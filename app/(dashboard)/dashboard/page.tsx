'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { TrendingUp, Users, Leaf } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useUser()
  const [groupCount, setGroupCount] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [groupOrdersJoined, setGroupOrdersJoined] = useState(0)

  // Fetch CO2 from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('paypack_joined_orders')
    const joinedOrders = saved ? JSON.parse(saved) : []
    setGroupOrdersJoined(joinedOrders.length)
  }, [])

  useEffect(() => {
    if (!user) return

    supabase
      .from('groups')
      .select('*', { count: 'exact' })
      .eq('created_by', user.id)
      .then(({ count }) => setGroupCount(count || 0))

    supabase
      .from('groups')
      .select('id')
      .eq('created_by', user.id)
      .then(async ({ data: groups }) => {
        if (!groups || groups.length === 0) return
        const groupIds = groups.map(g => g.id)
        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .in('group_id', groupIds)
        const total = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0
        setTotalExpenses(total)
      })
  }, [user])

  const co2Saved = groupOrdersJoined * 0.4

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Good morning, {user?.firstName || 'there'} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's your PayPack summary</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-500 rounded-2xl p-4 text-white col-span-2">
          <p className="text-green-100 text-xs font-medium">Total Group Expenses</p>
          <p className="text-3xl font-bold mt-1">₹{totalExpenses.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-green-200" />
            <span className="text-green-200 text-xs">Across {groupCount} group{groupCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-gray-400 text-xs font-medium">Active Groups</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">{groupCount}</p>
          <div className="flex items-center gap-1 mt-2">
            <Users size={12} className="text-gray-400" />
            <span className="text-gray-400 text-xs">Total groups</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-gray-400 text-xs font-medium">CO₂ Saved</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">{co2Saved.toFixed(1)}kg</p>
          <div className="flex items-center gap-1 mt-2">
            <Leaf size={12} className="text-green-400" />
            <span className="text-gray-400 text-xs">{groupOrdersJoined} group order{groupOrdersJoined !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'New Group', emoji: '👥', href: '/groups/new' },
            { label: 'Optimize Pay', emoji: '⚡', href: '/optimizer' },
            { label: 'Group Buy', emoji: '🌿', href: '/groupbuy' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-green-200 hover:bg-green-50 transition-all"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs text-gray-600 font-medium text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <RecentGroups userId={user?.id} />
    </div>
  )
}

function RecentGroups({ userId }: { userId?: string }) {
  const [groups, setGroups] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('groups')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setGroups(data || []))
  }, [userId])

  if (groups.length === 0) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
      <span className="text-4xl">🎉</span>
      <p className="text-gray-800 font-medium mt-2">Welcome to PayPack!</p>
      <p className="text-gray-400 text-sm mt-1">Create your first group to get started</p>
      <Link
        href="/groups/new"
        className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-all"
      >
        Create Group
      </Link>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">Recent Groups</p>
        <Link href="/groups" className="text-xs text-green-500 font-medium">View all</Link>
      </div>
      <div className="space-y-2">
        {groups.map((g) => (
          <Link key={g.id} href={`/groups/${g.id}`}>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-green-200 transition-all">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">
                👥
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{g.name}</p>
                <p className="text-xs text-gray-400">{g.members.length} members</p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(g.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}