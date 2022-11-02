import dynamic from 'next/dynamic'

export const CatchQuotaCalculator = dynamic(
  () => import('./CatchQuotaCalculator'),
  { ssr: false },
)
