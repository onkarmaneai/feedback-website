const firstNames = [
  "Ada",
  "Terus",
  "Mika",
  "Luna",
  "Sora",
  "Ivy",
  "Nico",
  "Aria",
  "Raka",
  "Zane",
  "Ola",
  "Bima"
];

const lastNames = [
  "Komeng",
  "Adul",
  "Pramana",
  "Okta",
  "Wiyata",
  "Rizal",
  "Santoso",
  "Marlon",
  "Havari",
  "Laras",
  "Mahesa",
  "Nusantara"
];

const colors = [
  "#111827",
  "#1E293B",
  "#0F172A",
  "#1F2937",
  "#0B1120",
  "#334155",
  "#0C4A6E",
  "#155E75",
  "#164E63",
  "#1F2937"
];

export type DisplayIdentity = {
  name: string;
  color: string;
};

export function generateDisplayIdentity(usedNames: Set<string> = new Set()): DisplayIdentity {
  let name = "";
  let attempts = 0;

  while (!name || (usedNames.has(name) && attempts < 4)) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    name = `${first} ${last}`;
    attempts += 1;
  }

  const color = colors[Math.floor(Math.random() * colors.length)];
  return { name, color };
}
