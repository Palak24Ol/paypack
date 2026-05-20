export interface Offer {
  id: string
  method: string
  category: string
  platforms: string[]
  cashback_pct: number
  max_cashback: number | null
  min_amount: number
  type: 'credit_card' | 'upi_wallet' | 'upi_credit'
  scratch_card?: boolean
  note?: string
}

export interface Group {
  id: string
  name: string
  created_by: string
  members: string[]
  created_at: string
}

export interface Expense {
  id: string
  group_id: string
  description: string
  amount: number
  paid_by: string
  category: string
  split_between: string[]
  created_at: string
}

export interface User {
  id: string
  clerk_id: string
  name: string
  email: string
  upi_id?: string
  owned_methods: string[]
}

export interface GroupOrder {
  id: string
  seller: string
  item: string
  lat: number
  lng: number
  members: number
  max_members: number
  delivery_saving: number
}