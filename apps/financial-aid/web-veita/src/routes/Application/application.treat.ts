import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const applicantWrapper = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  columnGap: theme.spacing[3],
  width: '100%',
})

export const widthFull = style({
  gridColumn: '1/-1',
})

export const widthAlmostFull = style({
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridColumn: 'span 7',
    },
  },
})

export const modalBase = style({
  height: '100%',
  display: 'block',
})

export const modalContainer = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const modalHeadline = style({
  borderTopRightRadius: '12px',
  borderTopLeftRadius: '12px',
})

export const modal = style({
  display: 'block',
  width: '100%',
  maxWidth: '752px',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
  backgroundColor: 'white',
  borderRadius: '12px',
})

export const statusOptions = style({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  paddingLeft: theme.spacing[3],
  paddingBottom: theme.spacing[2],
  paddingTop: theme.spacing[2],
  borderRadius: '12px',
  fontWeight: 'lighter',
  transition: 'background-color ease 250ms, font-weight ease 50ms',
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
      fontWeight: 'bold',
    },
  },
  // padd: theme.spacing[3],
})

export const activeState = style({
  color: theme.color.blue400,
})
