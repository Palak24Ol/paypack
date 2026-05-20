import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/shared/BottomNav'
import Navbar from '@/components/shared/Navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-20 max-w-md mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}