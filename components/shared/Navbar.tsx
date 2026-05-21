'use client'

import { UserButton } from '@clerk/nextjs'
import { BellRing } from 'lucide-react'

export default function Navbar() {
  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 max-w-md mx-auto w-full sticky top-0 z-50">
      <span className="font-bold text-green-500 text-xl tracking-tight">
        Pay<span className="text-gray-800">Pack</span>
      </span>
      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-gray-600">
          <BellRing size={20} />
        </button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  )
}