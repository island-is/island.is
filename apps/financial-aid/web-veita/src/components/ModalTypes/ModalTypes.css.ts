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
