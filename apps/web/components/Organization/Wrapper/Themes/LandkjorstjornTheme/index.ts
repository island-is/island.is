import dynamic from 'next/dynamic'

export const LandskjorstjornFooter = dynamic(
  () => import('./LandkjorstjornFooter'),
  { ssr: false },
)

export const LandskjorstjornHeader = dynamic(
  () => import('./LandskjorstjornHeader'),
  { ssr: false },
)
