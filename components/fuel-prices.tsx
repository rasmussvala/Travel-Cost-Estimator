"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FuelAverages = {
  [fuelType: string]: number;
};

export default function FuelPrices() {
  const [averages, setAverages] = useState<FuelAverages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fuel")
      .then((res) => res.json())
      .then((data) => {
        setAverages(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Loading fuel prices..." />
        </SelectTrigger>
      </Select>
    );

  return (
    <div className="flex">
      {/* <p>Fuel</p> */}
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select fuel type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fuel Types</SelectLabel>
            <SelectItem value="95">95 – {averages?.["95"]} kr/l</SelectItem>
            <SelectItem value="diesel">
              Diesel – {averages?.["diesel"]} kr/l
            </SelectItem>
            <SelectItem value="etanol">
              Etanol – {averages?.["etanol"]} kr/l
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
