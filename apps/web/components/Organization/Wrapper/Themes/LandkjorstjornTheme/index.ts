import dynamic from 'next/dynamic'

import Header from './LandskjorstjornHeader'

export const LandskjorstjornFooter = dynamic(
  () => import('./LandkjorstjornFooter'),
  { ssr: true },
)

export const LandskjorstjornHeader = Header
