import { Input } from "@/components/ui/input";

type Props = {
  setFuelConsumption: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default function FuelConsumption({
  setFuelConsumption: setFuelConsumption,
}: Props) {
  return (
    <div className="inline-flex border rounded-md overflow-hidden w-32 border-border">
      <Input
        placeholder="6.7"
        type="number"
        min={0}
        step={0.1}
        className="
    rounded-none border-none flex-1 text-right bg-input text-foreground placeholder-muted-foreground
    [appearance:textfield]                     /* fallback + helps in Firefox */
    [-moz-appearance:textfield]               /* Firefox specifically */
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:m-0
    [&::-webkit-outer-spin-button]:m-0
             [moz-appearance:textfield]"
        onChange={(e) => {
          const value = e.target.value;
          setFuelConsumption(value ? parseFloat(value) : undefined);
        }}
      />
      <span className="px-2 flex items-center text-sm select-none bg-card text-card-foreground">
        l/100km
      </span>
    </div>
  );
}
