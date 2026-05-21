import PageHeader from '@/components/shared/PageHeader'

export default function OptimizerPage() {
  return (
    <div className="p-4 space-y-4">
      <PageHeader title="Pay Optimizer" subtitle="Find the best payment method" />
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <span className="text-4xl mb-2">⚡</span>
        <p className="text-gray-800 font-medium">Coming soon</p>
        <p className="text-gray-400 text-sm mt-1">Optimizer UI under construction</p>
      </div>
    </div>
  )
}