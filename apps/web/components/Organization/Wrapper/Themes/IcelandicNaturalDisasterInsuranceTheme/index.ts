import dynamic from 'next/dynamic'

export const IcelandicNaturalDisasterInsuranceHeader = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceHeader'),
  { ssr: false },
)
export const IcelandicNaturalDisasterInsuranceFooter = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceFooter'),
  { ssr: false },
)
