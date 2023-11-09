import dynamic from 'next/dynamic'

import Header from './FjarsyslaRikisinsHeader'

export const FjarsyslaRikisinsFooter = dynamic(
  () => import('./FjarsyslaRikisinsFooter'),
  { ssr: true },
)

export const FjarsyslaRikisinsHeader = Header
