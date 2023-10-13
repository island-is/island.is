import dynamic from 'next/dynamic'

export const RikissaksoknariHeader = dynamic(
  () => import('./RikissaksoknariHeader'),
  { ssr: false },
)
