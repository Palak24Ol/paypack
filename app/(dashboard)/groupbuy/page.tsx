'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateCO2Saved, formatCO2 } from '@/lib/co2'
import { Leaf, Users, MapPin, Package } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { GroupOrder } from '@/types'

export default function GroupBuyPage() {
  const [orders, setOrders] = useState<GroupOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState<string[]>([])
  const [totalCO2, setTotalCO2] = useState(0)

  useEffect(() => {
    supabase
      .from('group_orders')
      .select('*')
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [])

  const handleJoin = async (order: GroupOrder) => {
    if (joined.includes(order.id)) return
    const newMembers = order.members + 1
    await supabase
      .from('group_orders')
      .update({ members: newMembers })
      .eq('id', order.id)

    setOrders(prev =>
      prev.map(o => o.id === order.id ? { ...o, members: newMembers } : o)
    )
    setJoined(prev => [...prev, order.id])
    setTotalCO2(prev => prev + 0.4)
  }

  if (loading) return <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>

  return (
    <div className="p-4 space-y-5">
      <PageHeader title="Green Group Buy" subtitle="Order together, save the planet" />

      {/* Impact Banner */}
      <div className="bg-green-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={16} className="text-green-200" />
          <p className="text-green-100 text-xs font-medium">Your Impact Today</p>
        </div>
        <p className="text-2xl font-bold">{formatCO2(totalCO2)} CO₂ saved</p>
        <p className="text-green-100 text-xs mt-1">
          {joined.length} group order{joined.length !== 1 ? 's' : ''} joined · {(totalCO2 / 21 * 1000).toFixed(1)}g tree equivalent
        </p>
      </div>

      {/* How it works */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">How it works</p>
        <div className="space-y-2">
          {[
            { icon: '📍', text: 'See nearby orders from the same seller' },
            { icon: '🤝', text: 'Join to consolidate into one delivery' },
            { icon: '🌿', text: 'Save CO₂ + split delivery charges' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{step.icon}</span>
              <p className="text-sm text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Group Orders */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Nearby Group Orders
          <span className="ml-2 text-xs text-gray-400 font-normal">📍 Lucknow</span>
        </p>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <span className="text-4xl">🌿</span>
            <p className="text-gray-600 font-medium mt-2">No group orders nearby</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const isJoined = joined.includes(order.id)
              const spotsLeft = order.max_members - order.members
              const co2Saved = calculateCO2Saved(order.members)
              const fillPct = Math.round((order.members / order.max_members) * 100)

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-2xl p-4 transition-all ${isJoined ? 'border-green-300' : 'border-gray-100'}`}
                >
                  {isJoined && (
                    <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                      ✓ Joined
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400" />
                        <p className="font-semibold text-gray-800 text-sm">{order.item}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-400">{order.seller}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600 font-medium">Save ₹{order.delivery_saving}</p>
                      <p className="text-xs text-gray-400">delivery</p>
                    </div>
                  </div>

                  {/* Members progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{order.members}/{order.max_members} joined</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">
                        🌿 {formatCO2(co2Saved)} CO₂ saved
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoin(order)}
                    disabled={isJoined || spotsLeft <= 0}
                    className={`mt-3 w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
                      isJoined
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : spotsLeft <= 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isJoined ? '✓ Joined' : spotsLeft <= 0 ? 'Group Full' : `Join Group · ${spotsLeft} spots left`}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}