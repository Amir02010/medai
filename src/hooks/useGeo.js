import { useCallback } from "react";
import { useStore } from "../store/useStore";

/** Расстояние между точками по формуле гаверсинуса, км */
export function distanceKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function useGeo() {
  const location = useStore((s) => s.location);
  const status = useStore((s) => s.geoStatus);
  const setLocation = useStore((s) => s.setLocation);
  const setGeoStatus = useStore((s) => s.setGeoStatus);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  }, [setLocation, setGeoStatus]);

  return { location, status, request };
}
