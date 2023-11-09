import dynamic from 'next/dynamic'

import Header from './SjukratryggingarHeader'

export const SjukratryggingarHeader = Header

export const SjukratryggingarFooter = dynamic(
  () => import('./SjukratryggingarFooter'),
  { ssr: true },
)
