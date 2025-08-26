"use client";

import { useState, useEffect } from "react";

const MapboxSearchWrapper = () => {
  // i donno how to solve this so i will just ignore it lol, thx gpt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [SearchBox, setSearchBox] = useState<any>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    // Dynamically import on client only
    import("@mapbox/search-js-react").then((mod) => {
      setSearchBox(() => mod.SearchBox);
    });
  }, []);

  if (!SearchBox) return null; // render nothing on server

  return (
    <div>
      <SearchBox accessToken={token} />
    </div>
  );
};

export default MapboxSearchWrapper;
