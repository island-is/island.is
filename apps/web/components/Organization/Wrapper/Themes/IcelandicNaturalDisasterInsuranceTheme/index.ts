import dynamic from 'next/dynamic'

export const IcelandicNaturalDisasterInsuranceHeader = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceHeader'),
  { ssr: true },
)
export const IcelandicNaturalDisasterInsuranceFooter = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceFooter'),
  { ssr: true },
)
