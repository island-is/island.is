import dynamic from 'next/dynamic'

export const FjarsyslaRikisinsFooter = dynamic(
  () => import('./FjarsyslaRikisinsFooter'),
  { ssr: false },
)

export const FjarsyslaRikisinsHeader = dynamic(
  () => import('./FjarsyslaRikisinsHeader'),
  { ssr: false },
)
