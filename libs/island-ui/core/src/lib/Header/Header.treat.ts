import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { responsiveStyleMap } from '../../utils/responsiveStyleMap'

export const container = responsiveStyleMap({
  height: { xs: 80, md: 112 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const userNameContainer = style({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  marginLeft: theme.spacing[2],
  marginRight: theme.spacing[2],
})

export const actionsContainer = style({
  display: 'flex',
  alignItems: 'center',
})
