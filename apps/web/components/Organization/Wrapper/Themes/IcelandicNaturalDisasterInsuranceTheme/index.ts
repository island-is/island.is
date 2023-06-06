import dynamic from 'next/dynamic'

export const IcelandicNaturalDisasterInsuranceHeader = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceHeader'),
  { ssr: false },
)
export const IcelandicNaturalDisasterInsuranceHeaderFooter = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceFooter'),
  { ssr: false },
)
