import type { Property } from "@/types/property";

type MapPoint = {
  label: string;
  lat: number;
  lng: number;
};

const fallbackPoints: MapPoint[] = [
  { label: "City Center Gwalior", lat: 26.21828, lng: 78.18283 },
  { label: "University Road Gwalior", lat: 26.20588, lng: 78.19012 },
  { label: "Lashkar Gwalior", lat: 26.19936, lng: 78.16279 },
  { label: "Morar Gwalior", lat: 26.23086, lng: 78.22434 },
  { label: "Thatipur Gwalior", lat: 26.21892, lng: 78.20773 },
  { label: "Purani Chawani Gwalior", lat: 26.2592, lng: 78.1239 },
];

export function getPropertyMap(property: Property) {
  const point = choosePropertyPoint(property);
  const displayAddress = property.address || `${point.label}, Madhya Pradesh`;

  return {
    displayAddress,
    embedUrl: createGoogleMapsEmbed(`${point.lat},${point.lng}`, 15),
    directionsUrl: createGoogleMapsSearch(`${point.lat},${point.lng}`),
  };
}

export function getOfficeMap(address: string) {
  return {
    embedUrl: createGoogleMapsEmbed(address, 16),
    directionsUrl: createGoogleMapsSearch(address),
  };
}

function choosePropertyPoint(property: Property) {
  const text = `${property.slug} ${property.location} ${property.address ?? ""}`.toLowerCase();

  if (text.includes("west")) return fallbackPoints[1];
  if (text.includes("north")) return fallbackPoints[3];
  if (text.includes("commerce") || text.includes("commercial")) return fallbackPoints[2];
  if (text.includes("city") || text.includes("prime")) return fallbackPoints[0];

  return fallbackPoints[hashString(property.slug) % fallbackPoints.length];
}

function createGoogleMapsEmbed(query: string, zoom: number) {
  const encodedQuery = encodeURIComponent(query);
  return `https://www.google.com/maps?q=${encodedQuery}&z=${zoom}&output=embed`;
}

function createGoogleMapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}
