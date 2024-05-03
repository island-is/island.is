import dynamic from 'next/dynamic'

import Header from './HeilbrigdisstofnunAusturlandsHeader'

export const HeilbrigdisstofnunAusturlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsFooter'),
  { ssr: false },
)

export const HeilbrigdisstofnunAusturlandsHeader = Header
