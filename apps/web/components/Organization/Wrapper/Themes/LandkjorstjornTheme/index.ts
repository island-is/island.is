import dynamic from 'next/dynamic'

export const LandskjorstjornFooter = dynamic(
  () => import('./LandkjorstjornFooter'),
  { ssr: true },
)

export const LandskjorstjornHeader = dynamic(
  () => import('./LandskjorstjornHeader'),
  { ssr: true },
)
