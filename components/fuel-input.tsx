import { Input } from "@/components/ui/input";

export default function FuelInput() {
  return (
    <div className="inline-flex border rounded-md overflow-hidden w-32 border-border">
      <Input
        placeholder="6.7"
        className="rounded-none border-none flex-1 text-right bg-input text-foreground placeholder-muted-foreground"
      />
      <span className="px-2 flex items-center text-sm select-none bg-card text-card-foreground">
        l/100km
      </span>
    </div>
  );
}
