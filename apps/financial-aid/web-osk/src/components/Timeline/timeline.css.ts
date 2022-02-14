import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const timelineContainer = style({
  display: 'grid',
  gridTemplateColumns: '16px auto',
  position: 'relative',
  '::before': {
    content: "''",
    display: 'inline-block',
    backgroundColor: theme.color.purple200,
    width: theme.spacing[2],
    height: theme.spacing[2],
    borderRadius: theme.spacing[2],
    marginTop: '4px',
    zIndex: 1,
  },
})

export const activeState = style({
  '::before': {
    backgroundColor: theme.color.purple400,
  },
})

export const lineDown = style({
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
