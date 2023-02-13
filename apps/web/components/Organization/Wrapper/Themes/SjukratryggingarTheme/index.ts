import dynamic from 'next/dynamic'

export const SjukratryggingarHeader = dynamic(
  () => import('./SjukratryggingarHeader'),
  { ssr: false },
)

export const SjukratryggingarFooter = dynamic(
  () => import('./SjukratryggingarFooter'),
  { ssr: false },
)
