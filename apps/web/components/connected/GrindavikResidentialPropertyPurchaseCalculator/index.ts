import dynamic from 'next/dynamic'

export const GrindavikResidentialPropertyPurchaseCalculator = dynamic(
  () => import('./GrindavikResidentialPropertyPurchaseCalculator'),
  {
    ssr: true,
  },
)
