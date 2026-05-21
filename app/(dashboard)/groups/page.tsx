'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { Group } from '@/types'

export default function GroupsPage() {
  const { user } = useUser()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('groups')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setGroups(data || [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Groups</h1>
          <p className="text-sm text-gray-400 mt-0.5">Split bills with friends</p>
        </div>
        <Link
          href="/groups/new"
          className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-all"
        >
          <Plus size={20} />
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 text-sm">Loading...</p>
      ) : groups.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-2">👥</span>
          <p className="text-gray-800 font-medium">No groups yet</p>
          <p className="text-gray-400 text-sm mt-1">Create a group for your next trip or outing</p>
          <Link
            href="/groups/new"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-all"
          >
            Create Group
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <Link key={g.id} href={`/groups/${g.id}`}>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-green-200 transition-all">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Users size={18} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{g.name}</p>
                  <p className="text-xs text-gray-400">{g.members.length} members</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(g.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}