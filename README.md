<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
# 🩸 BloodBridge — Real-Time Emergency Blood & Hospital Network

> **Hackathon Submission** · React + TypeScript · Firebase · Gemini AI · Leaflet Maps

BloodBridge is an AI-powered emergency response platform that connects hospitals, donors, and dispatchers in real time — reducing critical blood procurement delays and helping save lives.

---

## 🚨 The Problem

Every minute counts in a medical emergency. Locating compatible blood donors, finding available hospital beds, and routing emergency resources is still a fragmented, manual process in most cities. BloodBridge solves this with a unified, intelligent dashboard.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Hospital Map** | Real-time Leaflet map with hospital markers, heatmap overlays, and nearest-hospital routing |
| 🤖 **Gemini AI Recommendations** | AI-driven suggestions for blood donor matching and hospital capacity prediction |
| 🏥 **Bed Availability Tracker** | Live ICU and general bed status across hospitals |
| 🩸 **Blood Request System** | Submit, track, and match blood requests by group, urgency, and proximity |
| 📍 **Donor Locator** | Geo-sorted donor list with availability status and last-donation tracking |
| 🚨 **Emergency Mode** | One-click emergency toggle that prioritizes critical alerts across the UI |
| 📡 **Live Alert Feed** | Real-time notifications panel with severity-coded alerts |
| 🌐 **Multi-Map Support** | Leaflet (OSM), Azure Maps, and OpenStreetMap backends |
| 🔄 **OSRM Routing ETA** | Turn-by-turn traffic ETA for dispatch coordination |
| 🌍 **i18n Ready** | Localisation strings built in from the start |

---

## 🏗️ Architecture

The app follows a clean layered architecture — Pages → Shell Components → Feature Components → Services/Hooks → External APIs — with global state managed in `App.tsx`.

**Tech Stack:**
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Maps:** Leaflet / react-leaflet, Azure Maps, OpenStreetMap / Overpass API
- **AI:** Google Gemini (`@google/genai`)
- **Backend/DB:** Firebase (Auth + Firestore), Express proxy server
- **Routing:** OSRM, React Router v7
- **Build:** Vite 6

---

## 🚀 Getting Started

```bash
# 1. Clone and install
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in: GEMINI_API_KEY, Firebase config, Azure Maps key

# 3. Run dev server
npm run dev
```

> The app uses an Express proxy (`server.ts`) to keep API keys server-side.

---

## 📁 Project Structure

```
src/
├── pages/          # LandingPage, Dashboard, MapPage, PlaceholderPage
├── components/
│   ├── map/        # HospitalMap, HospitalPopup, NearestStrip, HeatmapLayer
│   ├── sidebar/    # HospitalList, AIRecommendation, SearchFilters, StatusBar
│   ├── beds/       # BedAvailability
│   ├── header/     # Header, ApiKeyPrompt
│   └── ui/         # LiveTime, NumberAnimate
├── hooks/          # useUserLocation
├── api/            # firebase.ts, base44Client.ts
├── services/       # geminiService, osmService, hospitalService, trafficETA, nearestHospitals
└── types.ts        # BloodGroup, Urgency, Hospital, Donor, BloodRequest, Alert
```
---


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2541d56f-fc91-4042-9785-fc39d46e09af

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   ## 👥 Team

Built with ❤️ at Quad Brains · April 2026

---

## 📄 License

MIT
