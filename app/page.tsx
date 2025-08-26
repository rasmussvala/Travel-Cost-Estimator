import { ModeToggle } from "@/components/mode-toggle";
import MapboxMap from "@/components/mapbox-map";
import MapboxSearchWrapper from "@/components/mapbox-search-wrapper";

const Home = () => {
  return (
    <div>
      <ModeToggle />
      <MapboxSearchWrapper />
      <MapboxMap />
    </div>
  );
};

export default Home;
