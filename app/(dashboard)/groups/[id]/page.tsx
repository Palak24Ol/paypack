'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import ExpenseItem from '@/components/groups/ExpenseItem'
import BalanceSummary from '@/components/groups/BalanceSummary'
import AddExpenseModal from '@/components/groups/AddExpenseModal'
import { Group, Expense } from '@/types'

function calculateBalances(expenses: Expense[], members: string[]) {
  // Collect all people
  const allPeople = new Set<string>(members)
  expenses.forEach(e => {
    allPeople.add(e.paid_by)
    e.split_between.forEach(m => allPeople.add(m))
  })

  // Calculate net balance per person
  const net: Record<string, number> = {}
  allPeople.forEach(p => net[p] = 0)

  expenses.forEach((e) => {
    const perPerson = e.amount / e.split_between.length
    net[e.paid_by] += e.amount
    e.split_between.forEach((m) => { net[m] -= perPerson })
  })

  // Round ALL values to integers first — this eliminates floating point duplicates
  const balances = Array.from(allPeople).map(name => ({
    name,
    amt: Math.round(net[name])
  }))

  const result: { from: string; to: string; amount: number }[] = []

  // Guaranteed no duplicates — each iteration fully settles one person
  for (let iter = 0; iter < 50; iter++) {
    const creditor = balances.reduce((a, b) => a.amt > b.amt ? a : b)
    const debtor = balances.reduce((a, b) => a.amt < b.amt ? a : b)

    if (creditor.amt < 1 || debtor.amt > -1) break

    const amount = Math.min(creditor.amt, Math.abs(debtor.amt))

    result.push({ from: debtor.name, to: creditor.name, amount })

    creditor.amt -= amount
    debtor.amt += amount
  }

  return result
}

export default function GroupDetailPage() {
  const { id } = useParams()
  const { user } = useUser()
  const [group, setGroup] = useState<Group | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const fetchData = async () => {
    const { data: g } = await supabase.from('groups').select('*').eq('id', id).single()
    const { data: e } = await supabase.from('expenses').select('*').eq('group_id', id).order('created_at', { ascending: false })
    setGroup(g)
    setExpenses(e || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  if (loading) return <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
  if (!group) return <div className="p-4 text-center text-gray-400 text-sm">Group not found</div>

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const allBalances = calculateBalances(expenses, group.members)
  console.log('ALL BALANCES:', JSON.stringify(allBalances))
console.log('MEMBERS:', group.members)
console.log('EXPENSES:', expenses.map(e => ({ desc: e.description, paid: e.paid_by, split: e.split_between, amt: e.amount })))
  const currentUserName = user?.fullName || user?.emailAddresses[0]?.emailAddress || ''
  const myBalances = allBalances.filter(
    (b) => b.from === currentUserName || b.to === currentUserName
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/groups" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{group.name}</h1>
            <p className="text-xs text-gray-400">{group.members.length} members</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Total */}
      <div className="bg-green-500 rounded-2xl p-4 text-white">
        <p className="text-green-100 text-xs">Total Expenses</p>
        <p className="text-3xl font-bold mt-1">₹{total.toFixed(0)}</p>
        <p className="text-green-100 text-xs mt-1">{expenses.length} expenses · {group.members.length} members</p>
      </div>

      {/* Balances */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Who owes who</p>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-green-500 font-medium"
          >
            {showAll ? 'My balances' : 'View all'}
          </button>
        </div>
        <BalanceSummary
          balances={showAll ? allBalances : myBalances}
          groupName={group.name}
          currentUserName={currentUserName}
        />
      </div>

      {/* Expenses */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Expenses</p>
        {expenses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm">No expenses yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((e) => <ExpenseItem key={e.id} expense={e} />)}
          </div>
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          groupId={group.id}
          members={group.members}
          currentUser={user?.fullName || user?.emailAddresses[0]?.emailAddress || 'You'}
          onClose={() => setShowModal(false)}
          onAdded={fetchData}
        />
      )}
    </div>
  )
}