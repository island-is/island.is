import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const activeState = style({
  color: theme.color.blue400,
  cursor: 'initial',
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
    [`&:not(${activeState}):hover`]: {
      backgroundColor: theme.color.blue100,
      fontWeight: 'bold',
    },
  },
})

export const deductionFactor = style({
  display: 'grid',
  gridTemplateColumns: 'auto auto max-content',
  columnGap: theme.spacing[3],
  alignItems: 'center',
  marginBottom: theme.spacing[2],
})

export const rejectionEditable = style({
  display: 'inline-block',
  position: 'relative',
  minWidth: '269px',
  textDecoration: 'underline',
  textDecorationColor: theme.color.blue300,
  textUnderlineOffset: '4px',
  textDecorationThickness: '2px',
  fontSize: '20px',
  lineHeight: 1.5,
  fontWeight: 600,
  ':focus': {
    outline: 'none',
  },
  '::before': {
    content: '',
    display: 'block',
    width: 'calc(100% - 8px)',
    position: 'absolute',
    bottom: '0.5px',
    backgroundColor: theme.color.blue300,
    height: '2px',
  },
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: theme.spacing[3],
      '::before': {
        bottom: '2px',
      },
    },
  },
})
