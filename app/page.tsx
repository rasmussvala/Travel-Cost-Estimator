"use client";

import { ModeToggle } from "@/components/mode-toggle";
import MapboxMap from "@/components/mapbox-map";
import MapboxSearchWrapper from "@/components/mapbox-search-wrapper";
import { useEffect, useState } from "react";
import FuelPrices from "@/components/fuel-prices";
import FuelConsumption from "@/components/fuel-consumption";

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
  const [fuelPrice, setFuelPrice] = useState<number>();
  const [fuelConsumption, setFuelConsumption] = useState<number>();
  const [price, setPrice] = useState<number>();

  useEffect(() => {
    if (!fuelPrice || !fuelConsumption || !routeData) return;
    setPrice(
      ((fuelConsumption / 100) * fuelPrice * routeData.routes[0].distance) /
        1000
    );
  }, [fuelPrice, fuelConsumption, routeData]);

  return (
    <div className="p-2 sm:p-4">
      <header className="flex mb-8 justify-between">
        <h1 className="text-6xl font-extrabold tracking-tight">
          Travel Cost
          <br />
          Estimator
        </h1>
        <ModeToggle />
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="order-2 md:order-1 md:col-span-1 space-y-2">
          <h2 className="font-bold">Route</h2>
          <MapboxSearchWrapper
            setCoordinates={setStartCoordinates}
            setFullAddress={setStartFullAddress}
            placeholder="Start"
          />
          <p>{startFullAddress ? startFullAddress : "No location selected"}</p>
          <MapboxSearchWrapper
            setCoordinates={setEndCoordinates}
            setFullAddress={setEndFullAddress}
            placeholder="End"
          />
          <p>{endFullAddress ? endFullAddress : "No location selected"}</p>

          {/* <p>
            {routeData
              ? "Distance: " +
                (routeData.routes[0].distance / 1000).toFixed(1) +
                " km"
              : "Distance: 0.0 km"}
          </p> */}

          <br />

          <h2 className="font-bold">Fuel Prices</h2>
          <FuelPrices setFuelPrice={setFuelPrice} />

          <br />

          <h2 className="font-bold">Fuel Consumption</h2>
          <FuelConsumption setFuelConsumption={setFuelConsumption} />

          <br />
          <br />

          <h2 className="font-bold">Total Cost</h2>
          <p>
            Distance:{" "}
            {routeData
              ? (routeData.routes[0].distance / 1000).toFixed(1)
              : "0.0"}{" "}
            km
          </p>
          <p>Price: {price ? price.toFixed(1) : 0} kr</p>
          <br />
        </div>
        <div className="order-1 md:order-2 md:col-span-2">
          <MapboxMap
            start={startCoordinates}
            end={endCoordinates}
            setRouteData={setRouteData}
          />
        </div>
      </main>
      <footer className="text-center py-6 border-t border-border text-sm text-muted-foreground">
        2025 - Created by me,{" "}
        <a
          href="https://rasmussvala.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Rasmus
        </a>
      </footer>
    </div>
  );
};

export default Home;
