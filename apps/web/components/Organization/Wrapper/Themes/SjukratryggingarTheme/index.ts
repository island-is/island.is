import dynamic from 'next/dynamic'

export const SjukratryggingarFooter = dynamic(
  () => import('./SjukratryggingarFooter'),
  { ssr: true },
)
