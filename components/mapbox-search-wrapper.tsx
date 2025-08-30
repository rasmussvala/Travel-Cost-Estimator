// disable eslint warnings about "any" because i don't know how to solve it
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

const MapboxSearchWrapper = () => {
  const [SearchBox, setSearchBox] = useState<any>(null);
  const [resultCoordinates, setResultCoordinates] = useState(null);
  const [resultFullAddress, setResultFullAddress] = useState(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Dynamically import on client only
  useEffect(() => {
    import("@mapbox/search-js-react").then((mod) => {
      setSearchBox(() => mod.SearchBox);
    });
  }, []);

  const handleRetrieve = (response: any) => {
    const firstResult = response.features[0];

    // Extract coordinates and full adress
    const coordinates = firstResult.geometry.coordinates;
    const fullAddress = firstResult.properties.full_address;

    setResultCoordinates(coordinates);
    setResultFullAddress(fullAddress);
  };

  console.log(resultCoordinates);
  console.log(resultFullAddress);

  if (!SearchBox) return null; // Render nothing until Searchbox is initialized.

  return (
    <div>
      <SearchBox accessToken={token} onRetrieve={handleRetrieve} />
    </div>
  );
};

export default MapboxSearchWrapper;
