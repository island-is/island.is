import dynamic from 'next/dynamic'

export const IcelandicNaturalDisasterInsuranceFooter = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceFooter'),
  { ssr: true },
)
