import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100">
        <span className="font-bold text-green-500 text-xl">Pay<span className="text-gray-800">Pack</span></span>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          Sign in
        </Link>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6 py-16">
        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-4xl">
          💸
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Smart Payments<br />
            <span className="text-green-500">for India</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xs mx-auto leading-relaxed">
            Split bills instantly, find the best cashback method, and order green together.
          </p>
        </div>

        <Link
          href="/sign-up"
          className="bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-green-600 transition-all w-full max-w-xs text-center"
        >
          Get Started — It's Free
        </Link>

        <Link href="/sign-in" className="text-sm text-gray-400 hover:text-gray-600">
          Already have an account? Sign in
        </Link>
      </div>

      {/* Features */}
      <div className="px-6 pb-16 space-y-3 max-w-md mx-auto w-full">
        {[
          { emoji: '👥', title: 'Split & Settle', desc: 'Add expenses, auto-split, pay via UPI in one tap' },
          { emoji: '⚡', title: 'Pay Optimizer', desc: 'Find the best card or UPI app for max cashback' },
          { emoji: '🌿', title: 'Green Group Buy', desc: 'Join nearby orders, reduce CO₂, save on delivery' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">{f.emoji}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-xs text-gray-300">
        Built for Amazon HackOn 2025 · PayPack
      </div>
    </div>
  )
}