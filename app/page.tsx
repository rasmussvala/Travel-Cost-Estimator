"use client";

import { ModeToggle } from "@/components/mode-toggle";
import MapboxMap from "@/components/mapbox-map";
import MapboxSearchWrapper from "@/components/mapbox-search-wrapper";
import { useState } from "react";

type Coordinates = [number, number];

type DirectionsResponse = {
  routes: Array<{
    geometry: { coordinates: Coordinates[] };
    distance: number;
  }>;
};

const Home = () => {
  const [startCoordinates, setStartCoordinates] = useState<Coordinates>();
  const [endCoordinates, setEndCoordinates] = useState<Coordinates>();
  const [startFullAddress, setStartFullAddress] = useState<string>();
  const [endFullAddress, setEndFullAddress] = useState<string>();
  const [routeData, setRouteData] = useState<DirectionsResponse>();

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="order-2 lg:order-1 lg:col-span-1 space-y-2">
        <ModeToggle />
        <MapboxSearchWrapper
          setCoordinates={setStartCoordinates}
          setFullAddress={setStartFullAddress}
        />
        <p>{startFullAddress}</p>
        <MapboxSearchWrapper
          setCoordinates={setEndCoordinates}
          setFullAddress={setEndFullAddress}
        />
        <p>{endFullAddress}</p>

        {routeData && (
          <p>Distance: {(routeData.routes[0].distance / 1000).toFixed(1)} km</p>
        )}
      </div>
      <div className="order-1 lg:order-2 lg:col-span-2">
        <MapboxMap
          start={startCoordinates}
          end={endCoordinates}
          setRouteData={setRouteData}
        />
      </div>
    </div>
  );
};

export default Home;
