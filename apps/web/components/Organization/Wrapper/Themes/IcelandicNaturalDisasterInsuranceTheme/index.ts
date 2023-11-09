import dynamic from 'next/dynamic'

import Header from './IcelandicNaturalDisasterInsuranceHeader'

export const IcelandicNaturalDisasterInsuranceHeader = Header
export const IcelandicNaturalDisasterInsuranceFooter = dynamic(
  () => import('./IcelandicNaturalDisasterInsuranceFooter'),
  { ssr: true },
)
