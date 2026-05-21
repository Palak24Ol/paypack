'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Zap, Leaf, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/groups', icon: Users, label: 'Groups' },
  { href: '/optimizer', icon: Zap, label: 'Optimizer' },
  { href: '/groupbuy', icon: Leaf, label: 'GreenBuy' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around max-w-md mx-auto px-2 z-50">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <Icon
              size={22}
              className={isActive ? 'text-green-500' : 'text-gray-400'}
            />
            <span className={`text-[10px] ${isActive ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}