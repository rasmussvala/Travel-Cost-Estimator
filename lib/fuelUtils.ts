export type FuelAverages = {
  [fuelType: string]: number;
};

export function calculateFuelAverages(
  data: Record<string, string>
): FuelAverages {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("data_fran")) continue; // hoppa över metadata

    const parts = key.split("_");
    const fuelType = parts[parts.length - 1]; // sista delen = "95", "diesel", "etanol"
    const price = parseFloat(value);

    if (!sums[fuelType]) {
      sums[fuelType] = 0;
      counts[fuelType] = 0;
    }

    sums[fuelType] += price;
    counts[fuelType] += 1;
  }

  const averages: FuelAverages = {};
  for (const fuelType of Object.keys(sums)) {
    averages[fuelType] = parseFloat(
      (sums[fuelType] / counts[fuelType]).toFixed(2)
    );
  }

  return averages;
}
