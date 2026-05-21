'use client'

import { generateWhatsAppMessage } from '@/lib/upi'
import { ArrowRight } from 'lucide-react'

interface Balance {
  from: string
  to: string
  amount: number
}
interface Props {
  balances: Balance[]
  groupName: string
  currentUserName: string
}

export default function BalanceSummary({ balances, groupName, currentUserName }: Props) {
  if (balances.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
        <span className="text-2xl">🎉</span>
        <p className="text-green-700 font-medium text-sm mt-1">You're all settled up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {balances.map((b, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
  {b.from === currentUserName ? (
    <span className="text-sm font-medium text-red-500">You owe {b.to}</span>
  ) : (
    <span className="text-sm font-medium text-green-600">{b.from} owes you</span>
  )}
</div>
<span className={`font-bold ${b.from === currentUserName ? 'text-red-500' : 'text-green-600'}`}>
  ₹{b.amount}
</span>
          </div>
          <div className="flex gap-2 mt-3">
          
            <a 
              href={`upi://pay?pa=paypack@okaxis&pn=${encodeURIComponent(b.to)}&am=${b.amount}&cu=INR`}
              className="flex-1 bg-green-500 text-white rounded-xl py-2 text-xs font-medium text-center hover:bg-green-600 transition-all"
            >
              Pay via UPI
            </a>
            
           
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(
                generateWhatsAppMessage({
                  name: b.from,
                  amount: b.amount,
                  upiId: 'paypack@okaxis',
                  groupName,
                })
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-green-50 text-green-600 border border-green-200 rounded-xl py-2 text-xs font-medium text-center hover:bg-green-100 transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}