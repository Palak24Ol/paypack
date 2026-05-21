'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  groupId: string
  members: string[]
  currentUser: string
  onClose: () => void
  onAdded: () => void
}

const categories = ['food', 'shopping', 'travel', 'utility', 'grocery', 'other']

export default function AddExpenseModal({ groupId, members, currentUser, onClose, onAdded }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(currentUser)
  const [category, setCategory] = useState('food')
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members)
  const [loading, setLoading] = useState(false)

  const toggleMember = (m: string) => {
    setSelectedMembers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    )
  }

  const perPerson = amount && selectedMembers.length > 0
    ? (parseFloat(amount) / selectedMembers.length).toFixed(0)
    : 0

  const handleAdd = async () => {
    if (!description || !amount || selectedMembers.length === 0) return
    setLoading(true)

    await supabase.from('expenses').insert({
      group_id: groupId,
      description,
      amount: parseFloat(amount),
      paid_by: paidBy,
      category,
      split_between: selectedMembers,
    })

    onAdded()
    onClose()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 overflow-y-auto max-h-[85vh] pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Add Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <input
          suppressHydrationWarning
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this for? e.g. Dinner"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
        />

        <input
          suppressHydrationWarning
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          type="number"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
        />

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Paid by</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
          >
            {members.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                  category === c
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Split between selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Split between</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <button
                key={m}
                onClick={() => toggleMember(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedMembers.includes(m)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {selectedMembers.length > 0 && amount && (
            <p className="text-xs text-gray-400">
              ₹{perPerson}/person · {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''}
            </p>
          )}
          {selectedMembers.length === 0 && (
            <p className="text-xs text-red-400">Select at least one member</p>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!description || !amount || selectedMembers.length === 0 || loading}
          className="w-full bg-green-500 text-white rounded-2xl py-4 font-semibold text-sm hover:bg-green-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </div>
    </div>
  )
}