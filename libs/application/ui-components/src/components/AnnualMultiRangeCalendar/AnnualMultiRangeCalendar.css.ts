import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const calendarGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
  '@media': {
    'screen and (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const monthCard = style({
  background: theme.color.blue100,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: 8,
  padding: 16,
})

export const monthHeader = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  marginLeft: -16,
  marginRight: -16,
  paddingBottom: 16,
})

export const weekGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  columnGap: 0,
  rowGap: 4,
  marginTop: 16,
})

export const weekDay = style({
  fontSize: 11,
  fontWeight: 600,
  textAlign: 'center',
})

export const dayPlaceholder = style({
  minHeight: 28,
})

export const calendarDay = style({
  appearance: 'none',
  background: 'transparent',
  border: 0,
  borderRadius: 5,
  color: theme.color.blue600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  minHeight: 28,
  overflow: 'hidden',
  padding: 0,
  position: 'relative',
  selectors: {
    '&:hover': {
      background: theme.color.blue100,
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 3px ${theme.color.mint400}`,
      outline: 0,
      zIndex: 1,
    },
  },
})

export const selectedDay = style([
  calendarDay,
  {
    background: theme.color.blue400,
    color: theme.color.white,
    selectors: {
      '&:hover': {
        background: theme.color.blue600,
      },
    },
  },
])

export const inRangeDay = style([
  calendarDay,
  {
    background: theme.color.blue200,
    color: theme.color.blue600,
    selectors: {
      '&:hover': {
        background: theme.color.blue300,
      },
    },
  },
])

export const previewDay = style([
  calendarDay,
  {
    background: theme.color.blue100,
    color: theme.color.blue600,
  },
])

export const connectedLeft = style({
  borderBottomLeftRadius: 0,
  borderTopLeftRadius: 0,
})

export const connectedRight = style({
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
})

export const continuesFromPreviousMonth = style({
  selectors: {
    '&::before': {
      background: `linear-gradient(to right, ${theme.color.blue100}, transparent)`,
      bottom: 0,
      content: '""',
      left: 0,
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      width: '40%',
    },
  },
})

export const continuesIntoNextMonth = style({
  selectors: {
    '&::after': {
      background: `linear-gradient(to right, transparent, ${theme.color.blue100})`,
      bottom: 0,
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
      width: '40%',
    },
  },
})
