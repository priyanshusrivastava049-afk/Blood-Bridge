export function getStoredApiKey() {
  return localStorage.getItem('MAPS_API_KEY') || "";
}

export function setApiKey(key) {
  localStorage.setItem('MAPS_API_KEY', key);
}

export function clearApiKey() {
  localStorage.removeItem('MAPS_API_KEY');
}

export async function enrichWithLiveETAs(hospitals, userPos, apiKey) {
  // Mocking enrichment if no key
  if (!apiKey) return hospitals;
  
  // Real implementation would call Google Distance Matrix API
  // For brevity in this turn, we stick to the provided UI flow
  return hospitals;
}
