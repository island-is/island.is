import dynamic from 'next/dynamic'

import Header from './TryggingastofnunHeader'

export const TryggingastofnunHeader = Header

export const TryggingastofnunFooter = dynamic(
  () => import('./TryggingastofnunFooter'),
  { ssr: true },
)
