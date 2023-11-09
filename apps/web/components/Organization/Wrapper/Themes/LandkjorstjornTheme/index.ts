import dynamic from 'next/dynamic'

import Header from './LandkjorstjornHeader'

export const LandskjorstjornFooter = dynamic(
  () => import('./LandkjorstjornFooter'),
  { ssr: true },
)

export const LandskjorstjornHeader = Header
