import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'

const border = `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.color.dark100}`

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
  paddingLeft: theme.spacing['6'],
  backgroundColor: theme.color.white,
  borderBottom: border,
})

export const placeholder = style({
  height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
})

export const divider = style({
  height: '100%',
  borderRight: `1px solid ${theme.color.dark100}`,
})
