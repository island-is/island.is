import dynamic from 'next/dynamic'

export const StraddlingStockCalculator = dynamic(
  () => import('./StraddlingStockCalculator'),
  { ssr: false },
)
