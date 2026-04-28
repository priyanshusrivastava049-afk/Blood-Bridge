import { useState, useEffect, useRef } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    const opts: PositionOptions = { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 };

    const onSuccess = (pos: GeolocationPosition) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      setError(null);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    watchId.current = navigator.geolocation.watchPosition(onSuccess, onError, opts);

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return { location, error };
}
