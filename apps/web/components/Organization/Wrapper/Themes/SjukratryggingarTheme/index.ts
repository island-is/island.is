import dynamic from 'next/dynamic'

import DefaultHeader from './SjukratryggingarDefaultHeader'

export const SjukratryggingarDefaultHeader = DefaultHeader

export const SjukratryggingarFooter = dynamic(
  () => import('./SjukratryggingarFooter'),
  { ssr: true },
)
