"use client";

import { ModeToggle } from "@/components/mode-toggle";
import MapboxMap from "@/components/mapbox-map";
import MapboxSearchWrapper from "@/components/mapbox-search-wrapper";
import { useState } from "react";

type Coordinates = [number, number];

const Home = () => {
  const [startCoordinates, setStartCoordinates] = useState<Coordinates>([0, 0]);
  const [endCoordinates, setEndCoordinates] = useState<Coordinates>([0, 0]);
  // const [fullAddress, setFullAddress] = useState(null);

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="order-2 lg:order-1 lg:col-span-1">
        <ModeToggle />
        <MapboxSearchWrapper setCoordinates={setStartCoordinates} />
        <MapboxSearchWrapper setCoordinates={setEndCoordinates} />
      </div>
      <div className="order-1 lg:order-2 lg:col-span-2">
        <MapboxMap start={startCoordinates} end={endCoordinates} />
      </div>
    </div>
  );
};

export default Home;
