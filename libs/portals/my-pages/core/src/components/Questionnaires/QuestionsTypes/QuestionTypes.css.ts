import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
export const scaleContainer = style({})

export const scaleButton = style({
  borderRight: '1px solid',
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: theme.color.blue200,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue400,
      fontWeight: 500,
      color: `${theme.color.white} !important`,
      border: '1px solid',
      cursor: 'pointer',
      borderColor: theme.color.blue400,
    },
    '&:first-of-type': {
      borderTopLeftRadius: theme.border.radius.standard,
      borderBottomLeftRadius: theme.border.radius.standard,
      borderLeft: '1px solid',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: theme.color.blue200,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.border.radius.standard,
      borderBottomRightRadius: theme.border.radius.standard,
    },
  },
})

export const scaleButtonSelected = style({
  border: '1px solid',
  borderColor: theme.color.blue400,
  fontWeight: 500,
  backgroundColor: theme.color.blue400,
  color: theme.color.white,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue400,
      border: '1px solid',
      cursor: 'pointer',
      color: theme.color.white,
      borderColor: theme.color.blue400,
    },
  },
})

export const outerSlider = style({
  height: 16,
  padding: 4,
})

// globalStyle(`${scaleContainer} ${scaleButton}:first-child`, {
//   borderTopLeftRadius: theme.border.radius.standard,
//   borderBottomLeftRadius: theme.border.radius.standard,
//   borderLeft: '1px solid',
//   borderTop: '1px solid',
//   borderBottom: '1px solid',
//   borderColor: theme.color.blue200,
// })

// globalStyle(`${scaleContainer} ${scaleButton}:last-child`, {
//   borderTopRightRadius: theme.border.radius.standard,
//   borderBottomRightRadius: theme.border.radius.standard,
// })
