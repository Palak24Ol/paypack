'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'

export default function NewGroupPage() {
  const router = useRouter()
  const { user } = useUser()
  const [name, setName] = useState('')
  const [memberInput, setMemberInput] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addMember = () => {
    if (memberInput.trim() && !members.includes(memberInput.trim())) {
      setMembers([...members, memberInput.trim()])
      setMemberInput('')
    }
  }

  const removeMember = (m: string) => {
    setMembers(members.filter((x) => x !== m))
  }

  const handleCreate = async () => {
    if (!name.trim() || !user) return
    setLoading(true)

    const allMembers = [user.fullName || user.emailAddresses[0].emailAddress, ...members]

    const { data, error } = await supabase
      .from('groups')
      .insert({ name, created_by: user.id, members: allMembers })
      .select()
      .single()

    if (data) router.push(`/groups/${data.id}`)
    setLoading(false)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/groups" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">New Group</h1>
      </div>

      {/* Group Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Group Name</label>
        <input
          suppressHydrationWarning
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Goa Trip 🏖️"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-all"
        />
      </div>

      {/* Add Members */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Add Members</label>
        <div className="flex gap-2">
          <input
            suppressHydrationWarning
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
            placeholder="Enter name or UPI ID"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-all"
          />
          <button
            onClick={addMember}
            className="bg-green-500 text-white rounded-xl px-4 hover:bg-green-600 transition-all"
          >
            <Plus size={18} />
          </button>
        </div>

        {members.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {members.map((m) => (
              <div key={m} className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <span className="text-sm text-green-700">{m}</span>
                <button onClick={() => removeMember(m)}>
                  <X size={14} className="text-green-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* You are automatically added note */}
      <p className="text-xs text-gray-400">You are automatically added as a member.</p>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={!name.trim() || loading}
        className="w-full bg-green-500 text-white rounded-2xl py-4 font-semibold text-sm hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </div>
  )
}