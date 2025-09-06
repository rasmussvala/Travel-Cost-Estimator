// disable eslint warnings about "any" because i don't know how to solve it
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

type Coordinates = [number, number];

type Props = {
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates | undefined>>;
  setFullAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const MapboxSearchWrapper = ({
  setCoordinates: setCoordinates,
  setFullAddress: setFullAddress,
}: Props) => {
  const [SearchBox, setSearchBox] = useState<any>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Dynamically import on client only
  useEffect(() => {
    import("@mapbox/search-js-react").then((mod) => {
      setSearchBox(() => mod.SearchBox);
    });
  }, []);

  const handleRetrieve = (response: any) => {
    if (!setCoordinates || !setFullAddress) return;

    const firstResult = response.features[0];

    // Extract coordinates and full adress
    const coordinates = firstResult.geometry.coordinates;
    const fullAddress = firstResult.properties.full_address;

    setCoordinates(coordinates);
    setFullAddress(fullAddress);
  };

  if (!SearchBox) return null; // Render nothing until Searchbox is initialized.

  return (
    <div>
      <SearchBox accessToken={token} onRetrieve={handleRetrieve} />
    </div>
  );
};

export default MapboxSearchWrapper;
