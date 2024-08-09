import { style } from '@vanilla-extract/css'

export const menuStyle = style({
  position: 'relative',
  zIndex: 20,
})

export const sidebarCardContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '24px',
})

export const digitalIcelandHeaderTitle = style({
  background:
    'linear-gradient(122.37deg, #0161FD -20.11%, #3F46D2 19.5%, #812EA4 60.71%, #C21578 101.91%, #FD0050 138.36%)',
  backgroundClip: 'text',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ['-webkit-text-fill-color' as any]: 'transparent',
  textShadow: '0px 0px #00000000',
})
