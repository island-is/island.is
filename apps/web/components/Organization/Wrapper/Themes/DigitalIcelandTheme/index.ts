import dynamic from 'next/dynamic'

export const DigitalIcelandHeader = dynamic(
  () => import('./DigitalIcelandHeader'),
  { ssr: true },
)
