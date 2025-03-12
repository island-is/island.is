import dynamic from 'next/dynamic'

export const RikislogmadurFooter = dynamic(
  () => import('./RikislogmadurFooter'),
  { ssr: true },
)
