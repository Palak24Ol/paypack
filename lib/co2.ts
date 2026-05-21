// Average CO2 per delivery in kg
const CO2_PER_DELIVERY = 0.4

export function calculateCO2Saved(soloDeliveries: number): number {
  if (soloDeliveries <= 1) return 0
  return parseFloat(((soloDeliveries - 1) * CO2_PER_DELIVERY).toFixed(2))
}

export function co2ToTrees(co2Kg: number): number {
  // 1 tree absorbs ~21kg CO2 per year
  return parseFloat((co2Kg / 21).toFixed(3))
}

export function formatCO2(kg: number): string {
  if (kg < 1) return `${(kg * 1000).toFixed(0)}g`
  return `${kg.toFixed(2)}kg`
}