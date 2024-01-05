import dynamic from 'next/dynamic'

import Header from './UtlendingastofnunHeader'

export const UtlendingastofnunHeader = Header

export const UtlendingastofnunFooter = dynamic(
  () => import('./UtlendingastofnunFooter'),
  { ssr: true },
)
