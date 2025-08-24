"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const [ismounted, setIsMounted] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  // Create map on mount
  useEffect(() => {
    // Early return if no container or map already initialized
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: {
          lightPreset: "day",
        },
      },
      center: [18, 59],
      zoom: 5,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
    };
  }, [token]);

  // Sorry for this...
  // Set isMounted to true after a short delay to ensure theme is loaded
  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 100);
  }, []);

  // Update map when theme changes and one time in the beginning
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setConfig("basemap", {
      lightPreset: resolvedTheme === "dark" ? "night" : "day",
    });
  }, [resolvedTheme, ismounted]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  );
}
