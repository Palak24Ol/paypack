import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { TrendingUp, Users, Leaf, Zap } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Link from 'next/link' // Added next/link for better client-side routing

export default async function DashboardPage() {
  const { userId } = await auth()

  return (
    <div className="p-4 space-y-6">
      <PageHeader
        title="Good morning 👋"
        subtitle="Here's your PayPack summary"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-500 rounded-2xl p-4 text-white">
          <p className="text-green-100 text-xs font-medium">Total Saved</p>
          <p className="text-2xl font-bold mt-1">₹0</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-green-200" />
            <span className="text-green-200 text-xs">This month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-gray-400 text-xs font-medium">Pending Dues</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">₹0</p>
          <div className="flex items-center gap-1 mt-2">
            <Users size={12} className="text-gray-400" />
            <span className="text-gray-400 text-xs">0 groups</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-gray-400 text-xs font-medium">CO₂ Saved</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">0 kg</p>
          <div className="flex items-center gap-1 mt-2">
            <Leaf size={12} className="text-green-400" />
            <span className="text-gray-400 text-xs">0 group orders</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-gray-400 text-xs font-medium">Best Method</p>
          <p className="text-lg font-bold mt-1 text-gray-800">--</p>
          <div className="flex items-center gap-1 mt-2">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-gray-400 text-xs">Run optimizer</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
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
      {/* Recent Activity */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</p>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-2">🎉</span>
          
          <p className="text-gray-800 font-medium">You&apos;re all set!</p>
          <p className="text-gray-400 text-sm mt-1">Create a group or run the optimizer to get started</p>
        </div>
      </div>
    </div>
  )
}