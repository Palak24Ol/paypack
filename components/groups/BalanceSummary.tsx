'use client'

import { generateWhatsAppMessage } from '@/lib/upi'

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
      {balances.map((b, i) => {
        const youAreDebtor   = b.from === currentUserName   // you owe someone
        const youAreCreditor = b.to   === currentUserName   // someone owes you

        // ─── Bug fix #3: three-way label logic.
        // Previous code only checked b.from === currentUserName, so in "View all"
        // mode any settlement between two OTHER people showed "{person} owes you",
        // which is wrong. Now we correctly handle all three cases.
        const label = youAreDebtor
          ? <span className="text-sm font-medium text-red-500">You owe {b.to}</span>
          : youAreCreditor
            ? <span className="text-sm font-medium text-green-600">{b.from} owes you</span>
            : <span className="text-sm font-medium text-gray-500">{b.from} owes {b.to}</span>

        const amountColor = youAreDebtor
          ? 'text-red-500'
          : youAreCreditor
            ? 'text-green-600'
            : 'text-gray-500'

        return (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">{label}</div>
              <span className={`font-bold ${amountColor}`}>₹{b.amount}</span>
            </div>

            {/* Only show action buttons when the current user is involved */}
            {(youAreDebtor || youAreCreditor) && (
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
                    }),
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-50 text-green-600 border border-green-200 rounded-xl py-2 text-xs font-medium text-center hover:bg-green-100 transition-all"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}