import { FormStatus } from '@island.is/form-system/enums'
import { theme } from '@island.is/island-ui/theme'
import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css'

const highlightColor = createVar()
const highlightTextColor = createVar()

export const statusSummary = style({})

export const status = styleVariants(
  {
    [FormStatus.PUBLISHED]: {
      background: theme.color.mint400,
      text: theme.color.dark400,
    },
    [FormStatus.IN_DEVELOPMENT]: {
      background: theme.color.blue400,
      text: theme.color.white,
    },
    [FormStatus.PUBLISHED_BEING_CHANGED]: {
      background: theme.color.purple400,
      text: theme.color.white,
    },
  },
  (color) => ({
    vars: {
      [highlightColor]: color.background,
      [highlightTextColor]: color.text,
    },
  }),
)

globalStyle(`${statusSummary} button:is(:hover, :focus)`, {
  backgroundColor: highlightColor,
  color: highlightTextColor,
})

globalStyle(`${statusSummary} button:focus-visible`, {
  outline: `2px solid ${highlightColor}`,
  outlineOffset: 2,
})
