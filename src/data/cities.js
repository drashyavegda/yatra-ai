// Reference list of starting cities with approximate coordinates. Used only
// to estimate rough road distances for ordering destinations and budgeting.
// Any other city is accepted by the planner; distances are then estimated.

export const CITIES = [
  { name: 'Bengaluru', aliases: ['bangalore', 'bengaluru', 'blr'], lat: 12.972, lon: 77.594 },
  { name: 'Mysuru', aliases: ['mysore', 'mysuru'], lat: 12.295, lon: 76.639 },
  { name: 'Mangaluru', aliases: ['mangalore', 'mangaluru'], lat: 12.914, lon: 74.856 },
  { name: 'Hubballi', aliases: ['hubli', 'hubballi'], lat: 15.364, lon: 75.124 },
  { name: 'Dharwad', aliases: ['dharwad', 'dharwar'], lat: 15.46, lon: 75.01 },
  { name: 'Belagavi', aliases: ['belgaum', 'belagavi'], lat: 15.85, lon: 74.5 },
  { name: 'Shivamogga', aliases: ['shimoga', 'shivamogga'], lat: 13.93, lon: 75.57 },
  { name: 'Davanagere', aliases: ['davangere', 'davanagere'], lat: 14.466, lon: 75.924 },
  { name: 'Ballari', aliases: ['bellary', 'ballari'], lat: 15.14, lon: 76.92 },
  { name: 'Hosapete', aliases: ['hospet', 'hosapete'], lat: 15.27, lon: 76.39 },
  { name: 'Kalaburagi', aliases: ['gulbarga', 'kalaburagi'], lat: 17.33, lon: 76.83 },
  { name: 'Vijayapura', aliases: ['bijapur', 'vijayapura'], lat: 16.83, lon: 75.71 },
  { name: 'Udupi', aliases: ['udupi', 'manipal'], lat: 13.34, lon: 74.745 },
  { name: 'Hassan', aliases: ['hassan'], lat: 13.005, lon: 76.1 },
  { name: 'Tumakuru', aliases: ['tumkur', 'tumakuru'], lat: 13.34, lon: 77.1 },
  { name: 'Mandya', aliases: ['mandya'], lat: 12.52, lon: 76.9 },
  { name: 'Chikkamagaluru', aliases: ['chikmagalur', 'chikkamagaluru', 'chikmagaluru'], lat: 13.316, lon: 75.772 },
  { name: 'Madikeri', aliases: ['madikeri', 'coorg', 'kodagu'], lat: 12.42, lon: 75.74 },
  { name: 'Raichur', aliases: ['raichur'], lat: 16.2, lon: 77.35 },
  { name: 'Bidar', aliases: ['bidar'], lat: 17.91, lon: 77.52 },
  { name: 'Karwar', aliases: ['karwar'], lat: 14.81, lon: 74.13 },
  { name: 'Chennai', aliases: ['chennai', 'madras'], lat: 13.08, lon: 80.27 },
  { name: 'Hyderabad', aliases: ['hyderabad', 'secunderabad'], lat: 17.385, lon: 78.487 },
  { name: 'Panaji (Goa)', aliases: ['goa', 'panaji', 'panjim', 'madgaon', 'margao', 'vasco'], lat: 15.49, lon: 73.83 },
  { name: 'Kochi', aliases: ['kochi', 'cochin', 'ernakulam'], lat: 9.93, lon: 76.27 },
  { name: 'Mumbai', aliases: ['mumbai', 'bombay'], lat: 19.07, lon: 72.88 },
  { name: 'Pune', aliases: ['pune'], lat: 18.52, lon: 73.86 },
  { name: 'Coimbatore', aliases: ['coimbatore', 'kovai'], lat: 11.02, lon: 76.96 },
];

/**
 * Finds a reference city by name or alias. Returns null when unknown.
 */
export function findCity(input) {
  if (!input || typeof input !== 'string') return null;
  const key = input.trim().toLowerCase().replace(/[^a-z ]/g, '');
  if (!key) return null;
  return (
    CITIES.find((c) => c.name.toLowerCase() === key || c.aliases.includes(key)) ||
    CITIES.find((c) => c.aliases.some((a) => key.startsWith(a) || key.includes(a))) ||
    null
  );
}
