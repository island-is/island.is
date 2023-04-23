import dynamic from 'next/dynamic'

export const RikislogmadurHeader = dynamic(
  () => import('./RikislogmadurHeader'),
  { ssr: true },
)

export const RikislogmadurFooter = dynamic(
  () => import('./RikislogmadurFooter'),
  { ssr: true },
)
