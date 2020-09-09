import { style, styleMap, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { alignItems } from 'libs/island-ui/core/src/lib/Box/useBoxStyles.treat'
import { right } from 'libs/island-ui/core/src/lib/Timeline/Timeline.treat'

export const container = style({
  width: '100%',
  backgroundColor: theme.color.white,
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: theme.border.radius.large,
  borderColor: theme.color.blue200,
})

export const rightContainer = style({
  backgroundColor: theme.color.blue100,
  borderTopRightRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large
})