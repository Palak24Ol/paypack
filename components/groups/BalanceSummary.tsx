'use client'

import { useState } from 'react'
import { generateWhatsAppMessage } from '@/lib/upi'
import { QRCodeSVG } from 'qrcode.react'
import { X } from 'lucide-react'

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

function UPIQRModal({ upiLink, name, amount, onClose }: {
  upiLink: string
  name: string
  amount: number
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Scan to Pay</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-500 text-sm">Ask <strong>{name}</strong> to scan this QR</p>
        <div className="flex justify-center p-4 bg-gray-50 rounded-2xl">
          <QRCodeSVG value={upiLink} size={200} />
        </div>
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-green-700 font-bold text-xl">₹{amount}</p>
          <p className="text-green-600 text-xs mt-0.5">Scan with any UPI app</p>
        </div>
        <p className="text-xs text-gray-400">Works with PhonePe, GPay, Paytm & all UPI apps</p>
      </div>
    </div>
  )
}

export default function BalanceSummary({ balances, groupName, currentUserName }: Props) {
  const [qrData, setQrData] = useState<{ upiLink: string; name: string; amount: number } | null>(null)

  const savedUpiId = typeof window !== 'undefined'
    ? localStorage.getItem('paypack_upi_id') || 'paypack@okaxis'
    : 'paypack@okaxis'

  if (balances.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
        <span className="text-2xl">🎉</span>
        <p className="text-green-700 font-medium text-sm mt-1">You're all settled up!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {balances.map((b, i) => {
          const youAreDebtor = b.from === currentUserName
          const youAreCreditor = b.to === currentUserName

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

          const upiLink = `upi://pay?pa=${savedUpiId}&pn=${encodeURIComponent(b.to)}&am=${b.amount}&cu=INR&tn=${encodeURIComponent(`PayPack - ${groupName}`)}`

          return (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">{label}</div>
                <span className={`font-bold ${amountColor}`}>₹{b.amount}</span>
              </div>

              {(youAreDebtor || youAreCreditor) && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setQrData({ upiLink, name: b.from, amount: b.amount })}
                    className="flex-1 bg-green-500 text-white rounded-xl py-2 text-xs font-medium text-center hover:bg-green-600 transition-all"
                  >
                    📱 Show QR Code
                  </button>
                  
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      generateWhatsAppMessage({
                        name: b.from,
                        amount: b.amount,
                        upiId: savedUpiId,
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
              )}
            </div>
          )
        })}
      </div>

      {qrData && (
        <UPIQRModal
          upiLink={qrData.upiLink}
          name={qrData.name}
          amount={qrData.amount}
          onClose={() => setQrData(null)}
        />
      )}
    </>
  )
}