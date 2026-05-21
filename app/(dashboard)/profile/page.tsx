'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import { supabase } from '@/lib/supabase'

const paymentMethods = [
  { id: 'PhonePe UPI', label: 'PhonePe UPI', emoji: '💜' },
  { id: 'Google Pay', label: 'Google Pay', emoji: '🔵' },
  { id: 'Paytm UPI', label: 'Paytm UPI', emoji: '🔷' },
  { id: 'Amazon Pay UPI', label: 'Amazon Pay UPI', emoji: '🟠' },
  { id: 'BHIM UPI', label: 'BHIM UPI', emoji: '🇮🇳' },
  { id: 'CRED Pay', label: 'CRED Pay', emoji: '⚫' },
  { id: 'HDFC Millennia Card', label: 'HDFC Millennia Card', emoji: '💳' },
  { id: 'HDFC RuPay Credit Card', label: 'HDFC RuPay Card', emoji: '💳' },
  { id: 'Axis Ace Card', label: 'Axis Ace Card', emoji: '💳' },
  { id: 'ICICI Amazon Pay Card', label: 'ICICI Amazon Pay Card', emoji: '💳' },
  { id: 'SBI Cashback Card', label: 'SBI Cashback Card', emoji: '💳' },
  { id: 'Flipkart Axis Card', label: 'Flipkart Axis Card', emoji: '💳' },
  { id: 'Jupiter Edge+ Card', label: 'Jupiter Edge+ Card', emoji: '💳' },
  { id: 'Slice Card', label: 'Slice Card', emoji: '💳' },
  { id: 'Tata Neu HDFC Card', label: 'Tata Neu HDFC Card', emoji: '💳' },
  { id: 'Kiwi RuPay Card', label: 'Kiwi RuPay Card', emoji: '💳' },
  { id: 'IDFC First Wealth Card', label: 'IDFC First Wealth Card', emoji: '💳' },
]

export default function ProfilePage() {
  const { user } = useUser()
  const [selected, setSelected] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [upiId, setUpiId] = useState('')

  // Load saved methods from localStorage
  useEffect(() => {
    const savedMethods = localStorage.getItem('paypack_owned_methods')
    const savedUpi = localStorage.getItem('paypack_upi_id')
    if (savedMethods) setSelected(JSON.parse(savedMethods))
    if (savedUpi) setUpiId(savedUpi)
  }, [])

  const toggleMethod = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('paypack_owned_methods', JSON.stringify(selected))
    localStorage.setItem('paypack_upi_id', upiId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 space-y-5 pb-24">
      <PageHeader title="Profile" subtitle="Manage your account" />

      {/* User Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
        <UserButton />
        <div>
          <p className="font-semibold text-gray-800">{user?.fullName || 'User'}</p>
          <p className="text-sm text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
      </div>

      {/* UPI ID */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-700">Your UPI ID</p>
        <input
          suppressHydrationWarning
          value={upiId}
          onChange={(e) => { setUpiId(e.target.value); setSaved(false) }}
          placeholder="e.g. palak@okaxis"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-all"
        />
        <p className="text-xs text-gray-400">Used to generate UPI payment links for your groups</p>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-700">My Payment Methods</p>
          <p className="text-xs text-gray-400 mt-0.5">Select what you have — optimizer will only show these</p>
        </div>
        <div className="space-y-2">
          {paymentMethods.map((m) => {
            const isSelected = selected.includes(m.id)
            return (
              <button
                key={m.id}
                onClick={() => toggleMethod(m.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{m.emoji}</span>
                  <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                    {m.label}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full rounded-2xl py-4 font-semibold text-sm transition-all ${
          saved
            ? 'bg-green-100 text-green-600 border border-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {saved ? '✓ Saved!' : 'Save Preferences'}
      </button>
    </div>
  )
}