import dynamic from 'next/dynamic'

import Header from './HeilbrigdisstofnunNordurlandsHeader'

export const HeilbrigdisstofnunNordurlandsHeader = Header

export const HeilbrigdisstofnunNordurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunNordurlandsFooter'),
  { ssr: true },
)
