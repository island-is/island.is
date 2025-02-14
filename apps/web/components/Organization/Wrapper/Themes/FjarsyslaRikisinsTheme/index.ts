import dynamic from 'next/dynamic'

export const FjarsyslaRikisinsFooter = dynamic(
  () => import('./FjarsyslaRikisinsFooter'),
  { ssr: true },
)
