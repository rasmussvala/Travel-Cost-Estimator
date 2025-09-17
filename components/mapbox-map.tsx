"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";

type Coordinates = [number, number];

type DirectionsResponse = {
  routes: Array<{
    geometry: { coordinates: Coordinates[] };
    distance: number;
  }>;
};

type Props = {
  start: Coordinates | undefined;
  end: Coordinates | undefined;
  setRouteData: React.Dispatch<
    React.SetStateAction<DirectionsResponse | undefined>
  >;
};

const MapboxMap = ({
  start: start,
  end: end,
  setRouteData: setRouteData,
}: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);
  const { resolvedTheme } = useTheme();
  const [ismounted, setIsMounted] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const getDirections = async (start: Coordinates, end: Coordinates) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&overview=full&access_token=${token}`
    );
    const json = await query.json();

    setRouteData(json);
    displayRouteOnMap(json.routes[0]);
  };

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
        "line-emissive-strength": 0.95, // for lighting up the line in dark mode
      },
    });

    // Fit map to route bounds
    const coordinates = route.geometry.coordinates;
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((coord) => bounds.extend(coord as [number, number]));
    map.fitBounds(bounds, { padding: 50 });
  };

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
  };

  // Init
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: {
          lightPreset: "day",
        },
      },
      center: [28, 48],
      zoom: 2,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Sorry for this. Can't figure out a better solution
    setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    return () => {
      mapRef.current?.remove();
    };
  }, [token]);

  // Update map when theme changes and one time in the beginning
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setConfig("basemap", {
      lightPreset: resolvedTheme === "dark" ? "night" : "day",
    });
  }, [resolvedTheme, ismounted]);

  useEffect(() => {
    if (!start || !end) return;

    clearRoute();
    addMarkers(start, end);
    getDirections(start, end);
  }, [start, end]);

  return (
    <>
      <div ref={mapContainer} className="h-[400px] md:h-[800px] rounded-sm" />
      <br />
    </>
  );
};

export default MapboxMap;
