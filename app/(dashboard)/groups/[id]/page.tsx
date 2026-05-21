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

// ─── Bug fix #1: don't Math.round net balances before the algorithm runs.
// Rounding early (e.g. 33.33 → 33) makes the totals fail to sum to zero,
// leaving phantom debts nobody can ever pay off.
// Instead, keep floats throughout and only round the final transaction amount.
function calculateBalances(expenses: Expense[], members: string[]) {
  // Collect every participant
  const allPeople = new Set<string>(members)
  expenses.forEach(e => {
    allPeople.add(e.paid_by)
    e.split_between.forEach(m => allPeople.add(m))
  })

  // Net balance per person:  positive → is owed money,  negative → owes money
  const net: Record<string, number> = {}
  allPeople.forEach(p => (net[p] = 0))

  expenses.forEach(e => {
    const perPerson = e.amount / e.split_between.length
    net[e.paid_by] += e.amount          // payer is credited the full amount
    e.split_between.forEach(m => {      // each participant is debited their share
      net[m] -= perPerson
    })
  })

  // Keep floating-point precision — do NOT round here
  const balances = Array.from(allPeople).map(name => ({
    name,
    amt: net[name],
  }))

  const result: { from: string; to: string; amount: number }[] = []

  // Greedy debt-simplification: repeatedly pair the biggest creditor with the
  // biggest debtor until everyone is settled (within ₹0.50 rounding tolerance).
  for (let iter = 0; iter < 100; iter++) {
    const creditor = balances.reduce((a, b) => (a.amt > b.amt ? a : b))
    const debtor   = balances.reduce((a, b) => (a.amt < b.amt ? a : b))

    // Stop when the remaining imbalances are just floating-point dust
    if (creditor.amt < 0.5 || debtor.amt > -0.5) break

    const amount = Math.round(Math.min(creditor.amt, Math.abs(debtor.amt)))
    if (amount === 0) break

    result.push({ from: debtor.name, to: creditor.name, amount })

    creditor.amt -= amount
    debtor.amt   += amount
  }

  return result
}

// ─── Bug fix #2: resolve the current user's name from the members array.
// Clerk's user.fullName / email might not exactly match the free-text name
// that the group creator typed when adding this member (e.g. "Bob" vs "Bob Smith").
// We try every Clerk identifier against every member name (case-insensitive)
// and return the exact DB string so downstream filter comparisons always work.
function resolveCurrentUserName(
  user: ReturnType<typeof useUser>['user'],
  members: string[],
): string {
  if (!user) return ''

  const candidates = [
    user.fullName,
    user.firstName,
    user.lastName,
    user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null,
    user.emailAddresses[0]?.emailAddress,
    user.username,
  ].filter(Boolean) as string[]

  // Return the exact string as stored in the DB (preserves original casing)
  for (const candidate of candidates) {
    const match = members.find(
      m => m.trim().toLowerCase() === candidate.trim().toLowerCase(),
    )
    if (match) return match
  }

  // Fallback – no member matched; use fullName / email so at least new expenses
  // added by this user will still show up correctly.
  return user.fullName ?? user.emailAddresses[0]?.emailAddress ?? ''
}

export default function GroupDetailPage() {
  const { id } = useParams()
  const { user } = useUser()
  const [group,     setGroup    ] = useState<Group | null>(null)
  const [expenses,  setExpenses ] = useState<Expense[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading,   setLoading  ] = useState(true)
  const [showAll,   setShowAll  ] = useState(false)

  const fetchData = async () => {
    const { data: g } = await supabase.from('groups').select('*').eq('id', id).single()
    const { data: e } = await supabase
      .from('expenses')
      .select('*')
      .eq('group_id', id)
      .order('created_at', { ascending: false })
    setGroup(g)
    setExpenses(e ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  if (loading) return <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
  if (!group)  return <div className="p-4 text-center text-gray-400 text-sm">Group not found</div>

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const allBalances = calculateBalances(expenses, group.members)

  // Bug fix #2 (continued): resolve the name that matches the DB record
  const currentUserName = resolveCurrentUserName(user, group.members)

  // My balances: only settlements that directly involve the current user
  const myBalances = allBalances.filter(
    b => b.from === currentUserName || b.to === currentUserName,
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
        <p className="text-green-100 text-xs mt-1">
          {expenses.length} expenses · {group.members.length} members
        </p>
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
            {expenses.map(e => (
              <ExpenseItem key={e.id} expense={e} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          groupId={group.id}
          members={group.members}
          currentUser={currentUserName}
          onClose={() => setShowModal(false)}
          onAdded={fetchData}
        />
      )}
    </div>
  )
}