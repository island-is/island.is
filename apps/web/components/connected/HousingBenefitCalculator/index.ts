import dynamic from 'next/dynamic'

export const HousingBenefitCalculator = dynamic(
  () => import('./HousingBenefitCalculator'),
  {
    ssr: false,
  },
)
