import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const takeFullSpace = style({
  gridColumn: '1/-1',
})

export const timelineContainer = style({
  display: 'flex',
  position: 'relative',
  '::before': {
    content: "''",
    display: 'inline-block',
    backgroundColor: theme.color.purple400,
    width: theme.spacing[2],
    height: theme.spacing[2],
    borderRadius: theme.spacing[2],
    marginTop: '4px',
    zIndex: 1,
  },
  '::after': {
    content: "''",
    display: 'block',
    position: 'absolute',
    backgroundColor: theme.color.purple200,
    width: '2px',
    top: '8px',
    left: '7px',
    height: 'calc(100% - 4px)',
    borderRadius: theme.spacing[2],
  },
})

export const firstApplicationEvent = style({
  '::after': {
    height: 'calc(100% + 250px)',
  },
})

export const acceptedEvent = style({
  '::before': {
    backgroundColor: theme.color.mint400,
  },
})
export const rejectedEvent = style({
  '::before': {
    backgroundColor: theme.color.red400,
  },
})
