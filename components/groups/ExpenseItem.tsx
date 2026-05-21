import { Expense } from '@/types'
import { ShoppingCart, Utensils, Car, Zap, MoreHorizontal } from 'lucide-react'

const categoryIcons: Record<string, any> = {
  food: Utensils,
  shopping: ShoppingCart,
  travel: Car,
  utility: Zap,
  other: MoreHorizontal,
}

const categoryColors: Record<string, string> = {
  food: 'bg-orange-50 text-orange-500',
  shopping: 'bg-blue-50 text-blue-500',
  travel: 'bg-purple-50 text-purple-500',
  utility: 'bg-yellow-50 text-yellow-500',
  other: 'bg-gray-50 text-gray-500',
}

interface Props {
  expense: Expense
}

export default function ExpenseItem({ expense }: Props) {
  const Icon = categoryIcons[expense.category] || MoreHorizontal
  const colorClass = categoryColors[expense.category] || categoryColors.other
  const perPerson = Math.round(expense.amount / expense.split_between.length)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{expense.description}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Paid by {expense.paid_by} · ₹{perPerson}/person
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-gray-800">₹{expense.amount}</p>
        <p className="text-xs text-gray-400">{new Date(expense.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
      </div>
    </div>
  )
}