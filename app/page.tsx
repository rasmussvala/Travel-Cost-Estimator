"use client";

import { ModeToggle } from "@/components/mode-toggle";
import MapboxMap from "@/components/mapbox-map";
import MapboxSearchWrapper from "@/components/mapbox-search-wrapper";
import { useState } from "react";

type Coordinates = [number, number];

const Home = () => {
  const [endCoordinates, setEndCoordinates] = useState<Coordinates>([0, 0]);
  // const [fullAddress, setFullAddress] = useState(null);

  return (
    <div>
      <ModeToggle />
      <MapboxSearchWrapper setEndCoordinates={setEndCoordinates} />
      <MapboxSearchWrapper setEndCoordinates={setEndCoordinates} />
      <MapboxMap end={endCoordinates} />
    </div>
  );
};

export default Home;
