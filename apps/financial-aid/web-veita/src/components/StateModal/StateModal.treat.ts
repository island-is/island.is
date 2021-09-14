import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { borderColor } from 'libs/island-ui/core/src/lib/Box/useBoxStyles.treat'

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
})

export const activeState = style({
  color: theme.color.blue400,
})

export const container = style({
  display: 'flex',
  alignItems: 'flex-start',
  flexShrink: 0,
  overflow: 'hidden',
  width: '200%',
  transition: 'transform 250ms ease',
  transform: ' translate3d(0px, 0px, 0px)',
})

export const showInput = style({
  transform: ' translate3d(-50%, 0px, 0px)',
})
