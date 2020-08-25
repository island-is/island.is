import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM } from '@island.is/service-portal/constants'

export const menu = style({
  position: 'fixed',
  top: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  left: 0,
  opacity: 0,
  backgroundColor: theme.color.blue100,
  overflowY: 'auto',
  visibility: 'hidden',
  transition: 'opacity 200ms',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'absolute',
      top: 'auto',
    },
  }),
})

export const open = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const subjectButton = style({
  transition: 'color 200ms',
  ':hover': {
    color: theme.color.blue400,
  },
})

export const avatar = style({
  width: 75,
  height: 75,
  marginRight: theme.spacing['3'],
  backgroundSize: 'cover',
  borderRadius: '100%',
})
