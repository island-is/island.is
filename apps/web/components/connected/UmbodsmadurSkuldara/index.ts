import dynamic from 'next/dynamic'

export const UmsCostOfLivingCalculator = dynamic(
  () => import('./UmsCostOfLivingCalculator'),
  {
    ssr: true,
  },
)
