import dynamic from 'next/dynamic'

import Header from './HeilbrigdisstofnunAusturlandsHeader'

export const HeilbrigdisstofnunAusturlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsFooter'),
  { ssr: true },
)

export const HeilbrigdisstofnunAusturlandsHeader = Header
