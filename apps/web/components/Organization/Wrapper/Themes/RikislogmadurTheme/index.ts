import dynamic from 'next/dynamic'

export const RikislogmadurHeader = dynamic(
  () => import('./RikislogmadurHeader'),
  { ssr: false },
)

export const RikislogmadurFooter = dynamic(
  () => import('./RikislogmadurFooter'),
  { ssr: false },
)
