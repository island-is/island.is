import dynamic from 'next/dynamic'

import Header from './RikislogmadurHeader'

export const RikislogmadurHeader = Header

export const RikislogmadurFooter = dynamic(
  () => import('./RikislogmadurFooter'),
  { ssr: true },
)
