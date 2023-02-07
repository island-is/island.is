import dynamic from 'next/dynamic'

export const LandskjorstjornFooter = dynamic(() =>
  import('./LandkjorstjornFooter'),
)

export const LandskjorstjornHeader = dynamic(() =>
  import('./LandskjorstjornHeader'),
)
