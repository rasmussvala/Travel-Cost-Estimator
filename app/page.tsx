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
    <div>
      <ModeToggle />
      <MapboxSearchWrapper setCoordinates={setStartCoordinates} />
      <MapboxSearchWrapper setCoordinates={setEndCoordinates} />
      <MapboxMap start ={startCoordinates} end={endCoordinates} />
    </div>
  );
};

export default Home;
