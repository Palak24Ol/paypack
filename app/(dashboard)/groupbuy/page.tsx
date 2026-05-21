'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateCO2Saved, formatCO2 } from '@/lib/co2'
import { Leaf, Users, MapPin, Package, Map, List, Plus, X } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { GroupOrder } from '@/types'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/groupbuy/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading map...</p>
    </div>
  ),
})

function CreateOrderModal({
  onClose,
  onCreated,
  userLocation,
  currentUserId,
}: {
  onClose: () => void
  onCreated: () => void
  userLocation: { lat: number; lng: number } | null
  currentUserId: string
}) {
  const [item, setItem] = useState('')
  const [seller, setSeller] = useState('')
  const [maxMembers, setMaxMembers] = useState('5')
  const [deliverySaving, setDeliverySaving] = useState('30')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!item || !seller) return
    setLoading(true)
    await supabase.from('group_orders').insert({
      item,
      seller,
      lat: userLocation?.lat || 26.8467,
      lng: userLocation?.lng || 80.9462,
      members: 1,
      max_members: parseInt(maxMembers),
      delivery_saving: parseInt(deliverySaving),
      created_by: currentUserId,
    })
    onCreated()
    onClose()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Create Group Order</h2>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        <input
          suppressHydrationWarning
          value={item}
          onChange={e => setItem(e.target.value)}
          placeholder="What are you ordering? e.g. Groceries"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
        />
        <input
          suppressHydrationWarning
          value={seller}
          onChange={e => setSeller(e.target.value)}
          placeholder="Seller / Platform e.g. BigBasket - Gomti Nagar"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Max members</label>
            <select
              value={maxMembers}
              onChange={e => setMaxMembers(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-green-400"
            >
              {['3', '4', '5', '6', '8', '10'].map(n => (
                <option key={n} value={n}>{n} people</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Delivery saving (₹)</label>
            <input
              suppressHydrationWarning
              type="number"
              value={deliverySaving}
              onChange={e => setDeliverySaving(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-green-400"
            />
          </div>
        </div>

        {userLocation && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <MapPin size={12} /> Order will be placed at your current location
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={!item || !seller || loading}
          className="w-full bg-green-500 text-white rounded-2xl py-4 font-semibold text-sm hover:bg-green-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Group Order'}
        </button>
      </div>
    </div>
  )
}

export default function GroupBuyPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<GroupOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState<string[]>([])
  const [totalCO2, setTotalCO2] = useState(0)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [locationError, setLocationError] = useState(false)

  const storageKey = `paypack_joined_orders_${user?.id || 'guest'}`

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationError(true)
      )
    }
    fetchOrders()
  }, [])

  // Load joined orders only after user is available
  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(storageKey)
    const joinedOrders = saved ? JSON.parse(saved) : []
    setJoined(joinedOrders)
    setTotalCO2(joinedOrders.length * 0.4)
  }, [user])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('group_orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const handleJoin = async (order: GroupOrder) => {
    if (joined.includes(order.id)) return
    const newMembers = order.members + 1
    await supabase.from('group_orders').update({ members: newMembers }).eq('id', order.id)
    const newJoined = [...joined, order.id]
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, members: newMembers } : o))
    setJoined(newJoined)
    localStorage.setItem(storageKey, JSON.stringify(newJoined))
    setTotalCO2(prev => prev + 0.4)
  }

  if (loading) return <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>

  return (
    <div className="p-4 space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <PageHeader title="Green Group Buy" subtitle="Order together, save the planet" />
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Impact Banner */}
      <div className="bg-green-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={16} className="text-green-200" />
          <p className="text-green-100 text-xs font-medium">Your Impact Today</p>
        </div>
        <p className="text-2xl font-bold">{formatCO2(totalCO2)} CO₂ saved</p>
        <p className="text-green-100 text-xs mt-1">
          {joined.length} group order{joined.length !== 1 ? 's' : ''} joined
        </p>
      </div>

      {!locationError && !userLocation && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
          📍 Allow location access to see orders near you
        </div>
      )}
      {userLocation && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-600">
          📍 Showing orders near your location
        </div>
      )}

      {/* Map / List toggle */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setView('map')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'map' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'
          }`}
        >
          <Map size={14} /> Map View
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'
          }`}
        >
          <List size={14} /> List View
        </button>
      </div>

      {view === 'map' && (
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <MapView
            orders={orders}
            joined={joined}
            onJoin={handleJoin}
            userLocation={userLocation}
          />
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-3">
          {orders.map((order) => {
            const isJoined = joined.includes(order.id)
            const isOwner = order.created_by === user?.id
            const spotsLeft = order.max_members - order.members
            const co2Saved = calculateCO2Saved(order.members)
            const fillPct = Math.round((order.members / order.max_members) * 100)

            return (
              <div
                key={order.id}
                className={`bg-white border rounded-2xl p-4 transition-all ${
                  isOwner ? 'border-blue-200' : isJoined ? 'border-green-300' : 'border-gray-100'
                }`}
              >
                <div className="flex gap-2 mb-2">
                  {isOwner && (
                    <span className="text-xs bg-blue-50 text-blue-500 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                      👑 Your Order
                    </span>
                  )}
                  {isJoined && !isOwner && (
                    <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                      ✓ Joined
                    </span>
                  )}
                </div>

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
                  disabled={isJoined || spotsLeft <= 0 || isOwner}
                  className={`mt-3 w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
                    isOwner
                      ? 'bg-blue-50 text-blue-400 border border-blue-200 cursor-not-allowed'
                      : isJoined
                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed'
                        : spotsLeft <= 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isOwner
                    ? '👑 You created this'
                    : isJoined
                      ? '✓ Joined'
                      : spotsLeft <= 0
                        ? 'Group Full'
                        : `Join Group · ${spotsLeft} spots left`}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchOrders}
          userLocation={userLocation}
          currentUserId={user?.id || ''}
        />
      )}
    </div>
  )
}