"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

type Coordinates = [number, number]; // [longitude, latitude]

type DirectionsResponse = {
  routes: Array<{
    geometry: { coordinates: Coordinates[] };
    distance: number;
  }>;
};

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const [ismounted, setIsMounted] = useState(false);
  const [routeData, setRouteData] = useState(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  // Directions API function
  const getDirections = async (
    start: Coordinates,
    end: Coordinates,
    profile: string = "driving"
  ) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&overview=full&access_token=${token}`
    );

    const json = await query.json();

    setRouteData(json);
    displayRouteOnMap(json.routes[0]);
  };

  // Display route on map
  const displayRouteOnMap = (route: DirectionsResponse["routes"][0]) => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove existing route layer if it exists
    if (map.getLayer("route")) {
      map.removeLayer("route");
    }
    if (map.getSource("route")) {
      map.removeSource("route");
    }

    // Add route source and layer
    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route.geometry.coordinates,
        },
      },
    });

    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });

    // Fit map to route bounds
    const coordinates = route.geometry.coordinates;
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((coord) => bounds.extend(coord as [number, number]));
    map.fitBounds(bounds, { padding: 50 });
  };

  // Add markers for start and end points
  const addMarkers = (start: Coordinates, end: Coordinates) => {
    if (!mapRef.current) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll(".custom-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Start marker (green)
    new mapboxgl.Marker({ color: "#22c55e" })
      .setLngLat(start)
      .addTo(mapRef.current);

    // End marker (red)
    new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat(end)
      .addTo(mapRef.current);
  };

  // Example function to get directions between two points
  const getExampleDirections = () => {
    const start: Coordinates = [18.0686, 59.3293]; // Stockholm
    const end: Coordinates = [11.9746, 57.7089]; // Gothenburg

    addMarkers(start, end);
    getDirections(start, end, "driving");
  };

  // Clear route from map
  const clearRoute = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove route layer and source
    if (map.getLayer("route")) {
      map.removeLayer("route");
    }
    if (map.getSource("route")) {
      map.removeSource("route");
    }

    // Remove markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
    existingMarkers.forEach((marker) => marker.remove());

    setRouteData(null);
  };

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
    <div className="w-full">
      <div
        ref={mapContainer}
        className="h-[400px] rounded-lg overflow-hidden"
      />

      {/* Control buttons */}
      <div className="space-x-2">
        <Button onClick={getExampleDirections}>Get Directions</Button>
        <Button onClick={clearRoute}>Clear Route</Button>
      </div>

      {/* Route information */}
      {routeData && routeData.routes[0] && (
        <div>
          <h3 className="font-semibold">Route Information:</h3>
          <p>Distance: {(routeData.routes[0].distance / 1000).toFixed(2)} km</p>
        </div>
      )}
    </div>
  );
}
