import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const iconMargin = style({
  marginRight: theme.spacing[2],
})

export const userInfoContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(7, 1fr)',
    },
  },
})

export const mainInfo = style({
  gridColumn: 'span 4',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 3',
    },
  },
})

export const contactInfo = style({
  gridColumn: 'span 3',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 4',
    },
  },
})

export const taxReturn = style({
  color: theme.color.red400,
  fontWeight: 'bold',
})

export const modalContainer = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  // height: 100%;
  // display: 'flex'
  // align-items: center;
  // justify-content: center;
})

export const modal = style({
  maxWidth: '888px',
  width: '100%',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
})

export const exitModal = style({
  position: 'absolute',
  top: '0px',
  right: '0px',
  padding: theme.spacing[3],
})
