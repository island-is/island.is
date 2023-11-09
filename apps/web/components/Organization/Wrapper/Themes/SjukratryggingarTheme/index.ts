import dynamic from 'next/dynamic'

export const SjukratryggingarHeader = dynamic(
  () => import('./SjukratryggingarHeader'),
  { ssr: true },
)

export const SjukratryggingarFooter = dynamic(
  () => import('./SjukratryggingarFooter'),
  { ssr: true },
)
