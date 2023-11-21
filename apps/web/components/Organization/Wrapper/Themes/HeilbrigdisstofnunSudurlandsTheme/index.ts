import dynamic from 'next/dynamic'

import Header from './HeilbrigdisstofnunSudurlandsHeader'

export const HeilbrigdisstofnunSudurlandsHeader = Header

export const HeilbrigdisstofnunSudurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunSudurlandsFooter'),
  { ssr: true },
)
