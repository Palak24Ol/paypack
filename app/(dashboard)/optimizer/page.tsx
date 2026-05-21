'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getBestPaymentMethods } from '@/lib/optimizer'
import { Offer } from '@/types'
import { Zap, ChevronDown } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'

const categories = [
  { value: 'food', label: '🍕 Food Delivery' },
  { value: 'grocery', label: '🛒 Grocery' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'utility', label: '⚡ Utilities' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'dining', label: '🍽️ Dining Out' },
  { value: 'offline', label: '🏪 Offline Store' },
]

export default function OptimizerPage() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [offers, setOffers] = useState<Offer[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
const [ownedMethods, setOwnedMethods] = useState<string[]>([])

useEffect(() => {
  const saved = localStorage.getItem('paypack_owned_methods')
  if (saved) setOwnedMethods(JSON.parse(saved))
}, [])

  useEffect(() => {
    supabase.from('offers').select('*').then(({ data }) => {
      setOffers(data || [])
    })
  }, [])
 const handleOptimize = () => {
  if (!amount || parseFloat(amount) <= 0) return
  setLoading(true)
  const best = getBestPaymentMethods(parseFloat(amount), category, offers, ownedMethods)
  setResults(best)
  setHasSearched(true)
  setLoading(false)
}

  return (
    <div className="p-4 space-y-5">
      <PageHeader title="Pay Optimizer" subtitle="Find the best payment method" />

      {/* Amount Input */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
            <input
              suppressHydrationWarning
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-lg font-semibold outline-none focus:border-green-400 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 appearance-none transition-all"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={!amount || loading}
          className="w-full bg-green-500 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-all disabled:opacity-50"
        >
          <Zap size={16} />
          {loading ? 'Finding best method...' : 'Find Best Payment Method'}
        </button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <span className="text-3xl">🤔</span>
              <p className="text-gray-600 font-medium mt-2">No offers found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different category or amount</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700">
                Best methods for ₹{amount} on {categories.find(c => c.value === category)?.label}
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`bg-white border rounded-2xl p-4 ${i === 0 ? 'border-green-300 shadow-sm' : 'border-gray-100'}`}
                >
                  {i === 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">⚡ Best Choice</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{r.method}</p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{r.type?.replace('_', ' ')}</p>
                      {r.platforms?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Works on: {r.platforms.slice(0, 3).join(', ')}
                        </p>
                      )}
                      {r.note && <p className="text-xs text-green-600 mt-1">{r.note}</p>}
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-xl font-bold text-green-500">₹{r.savings}</p>
                      <p className="text-xs text-gray-400">saved</p>
                      <p className="text-xs text-gray-400">{r.cashback_pct}% back</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total potential savings */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center justify-between">
                <p className="text-sm text-green-700 font-medium">Max you can save</p>
                <p className="text-lg font-bold text-green-600">₹{results[0]?.savings || 0}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasSearched && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-2">⚡</span>
          <p className="text-gray-600 font-medium">Enter an amount to get started</p>
          <p className="text-gray-400 text-sm mt-1">We'll rank the best UPI apps and cards for your purchase</p>
        </div>
      )}
    </div>
  )
}