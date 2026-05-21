import { Offer } from '@/types'

export function getBestPaymentMethods(
  amount: number,
  category: string,
  offers: Offer[],
  ownedMethods: string[]
) {
  return offers
    .filter((o) => {
      const categoryMatch = o.category === category || o.category === 'all'
      const amountMatch = amount >= o.min_amount
      const owned = ownedMethods.length === 0 || ownedMethods.includes(o.method)
      return categoryMatch && amountMatch && owned
    })
    .map((o) => {
      const rawSavings = (amount * o.cashback_pct) / 100
      const savings = o.max_cashback ? Math.min(rawSavings, o.max_cashback) : rawSavings
      return { ...o, savings: Math.round(savings) }
    })
    .filter((o) => o.savings > 0)
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 5)
}