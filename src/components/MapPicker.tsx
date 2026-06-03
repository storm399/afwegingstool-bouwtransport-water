import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix voor default marker-icon (Leaflet zoekt naar bestanden die Vite niet meegeeft)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  lat: number;
  lon: number;
  onLocationChange: (lat: number, lon: number) => void;
}

/** Inner-component dat klikken op de kaart afvangt en marker verplaatst. */
function ClickHandler({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({ lat, lon, onLocationChange }: Props) {
  return (
    <div className="rounded-lg overflow-hidden border-2 border-bordeaux/20" style={{ height: '380px' }}>
      <MapContainer
        center={[lat, lon]}
        zoom={lat === 52.0907 ? 7 : 14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} />
        <ClickHandler onClick={onLocationChange} />
      </MapContainer>
    </div>
  );
}

/**
 * Adres → coördinaten via Nominatim (gratis OpenStreetMap geocoder).
 * Geen API-key nodig; let op rate limit (1 req/sec).
 */
export async function geocodeAdres(adres: string): Promise<{ lat: number; lon: number } | null> {
  if (!adres.trim()) return null;
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', adres);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'nl');
    const resp = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Afwegingstool-Bouwtransport-Water/1.0',
      },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (e) {
    console.error('Geocoding error:', e);
    return null;
  }
}
