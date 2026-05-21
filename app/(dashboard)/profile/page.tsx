import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import PageHeader from '@/components/shared/PageHeader'

export default async function ProfilePage() {
  const user = await currentUser()

  return (
    <div className="p-4 space-y-4">
      <PageHeader title="Profile" subtitle="Manage your account" />

      {/* User Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
        <UserButton />
        <div>
          <p className="font-semibold text-gray-800">{user?.fullName || 'User'}</p>
          <p className="text-sm text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
      </div>

      {/* My Payment Methods */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">My Payment Methods</p>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-sm text-gray-400 text-center">No methods added yet</p>
          <button className="mt-3 w-full bg-green-50 text-green-600 border border-green-200 rounded-xl py-2 text-sm font-medium hover:bg-green-100 transition-all">
            + Add Payment Method
          </button>
        </div>
      </div>
    </div>
  )
}