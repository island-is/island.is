import dynamic from 'next/dynamic'

export const FjarsyslaRikisinsFooter = dynamic(
  () => import('./FjarsyslaRikisinsFooter'),
  { ssr: true },
)

export const FjarsyslaRikisinsHeader = dynamic(
  () => import('./FjarsyslaRikisinsHeader'),
  { ssr: true },
)
