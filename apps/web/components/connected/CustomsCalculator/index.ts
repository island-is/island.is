import dynamic from 'next/dynamic'

export const CustomsCalculator = dynamic(
  () => import('./CustomsCalculator'),
  {
    ssr: false,
  },
)
