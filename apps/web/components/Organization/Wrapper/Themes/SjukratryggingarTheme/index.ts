import dynamic from 'next/dynamic'

import DefaultHeader from './SjukratryggingarDefaultHeader'
import Header from './SjukratryggingarHeader'

export const SjukratryggingarDefaultHeader = DefaultHeader
export const SjukratryggingarHeader = Header

export const SjukratryggingarFooter = dynamic(
  () => import('./SjukratryggingarFooter'),
  { ssr: true },
)
