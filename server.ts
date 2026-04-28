import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fetch from "node-fetch";
import NodeCache from "node-cache";

const app = express();
const PORT = 3000;

// Initialize Cache
const cache = new NodeCache({ stdTTL: 86400 }); // 24hr default TTL

interface Hospital {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'Government' | 'Private' | 'Unknown';
  emergency: 'confirmed' | 'likely' | 'unknown';
  phone: string;
  address: string;
  beds?: number;
  isGovernment: boolean;
}

function inferEmergency(tags: any): Hospital['emergency'] {
  if (tags.emergency === 'yes') return 'confirmed';
  const isGov = /public|government/i.test(tags['operator:type'] || '') || /government/i.test(tags.operator || '');
  const isLarge = tags.beds && parseInt(tags.beds) > 100;
  if (isGov || isLarge) return 'likely';
  return 'unknown';
}

function inferType(tags: any): Hospital['type'] {
  const op = (tags['operator:type'] || '').toLowerCase();
  const name = (tags.name || '').toLowerCase();
  const operator = (tags.operator || '').toLowerCase();
  
  if (op === 'public' || operator === 'government' || 
      name.includes('aiims') || name.includes('safdarjung') || 
      name.includes('ram manohar') || name.includes('super speciality')) return 'Government';
  
  if (op === 'private' || operator === 'private' || 
      name.includes('max') || name.includes('fortis') || 
      name.includes('apollo') || name.includes('medanta')) return 'Private';
      
  return 'Unknown';
}

app.use(express.json());

// API Route: Fetch Real Hospitals from Overpass API (OSM)
app.get("/api/hospitals", async (req, res) => {
  try {
    const cacheKey = 'delhi_ncr_hospitals';
    let hospitals = cache.get<Hospital[]>(cacheKey);
    
    if (hospitals) {
      return res.json(hospitals);
    }

    // Bounding box for Delhi-NCR
    const del = '28.4,76.8,28.9,77.5'; 
    const query = `[out:json][timeout:30];(node["amenity"="hospital"](${del});way["amenity"="hospital"](${del});relation["amenity"="hospital"](${del}););out center tags;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
    const data: any = await response.json();

    hospitals = data.elements
      .map((el: any) => {
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        if (!lat || !lng) return null;
        
        const tags = el.tags || {};
        const isGov = inferType(tags) === 'Government';
        
        return {
          id: el.id,
          name: tags.name || 'Unnamed Hospital',
          lat,
          lng,
          type: inferType(tags),
          emergency: inferEmergency(tags),
          phone: tags['contact:phone'] || tags.phone || 'N/A',
          address: tags['addr:full'] || tags['addr:street'] || 'N/A',
          beds: tags.beds ? parseInt(tags.beds) : undefined,
          isGovernment: isGov
        };
      })
      .filter((h: any): h is Hospital => h !== null);

    cache.set(cacheKey, hospitals);
    res.json(hospitals);
  } catch (error) {
    console.error("OSM Fetch Error:", error);
    res.status(500).json({ error: "Hospital data unavailable" });
  }
});

app.post('/api/hospitals/refresh', (req, res) => {
  cache.del('delhi_ncr_hospitals');
  res.json({ ok: true, message: 'Cache cleared' });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
