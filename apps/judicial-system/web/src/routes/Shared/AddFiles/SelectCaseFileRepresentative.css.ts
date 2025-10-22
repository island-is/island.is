import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const selectCaseFileRepresentative = style({
  marginBottom: `${theme.spacing[10]}px`,
})

// tune these to your design
const CUT = { top: 16, right: 16, bottom: 12, left: 18 } // how much edge to hide

/** Outer wrapper you add around the Select */
export const selectNoBorderOuter = style({
  overflow: 'hidden',

  // When the react-select menu is present, allow overflow so it isn't clipped
  selectors: {
    '&:has(.island-select__menu)': {
      overflow: 'visible',
    },
  },
})

/** Inner wrapper directly around the Select that pushes its border outside */
export const selectNoBorderInner = style({
  // pull the control outward so its border sits outside the clipped area
  margin: `-${CUT.top}px -${CUT.right}px -${CUT.bottom}px -${CUT.left}px`,
})

/** Typography overrides (scoped to this one instance) */
globalStyle(`${selectNoBorderOuter} .island-select__placeholder`, {
  color: theme.color.dark300,
  fontSize: 'small',
  lineHeight: '1.4',
  opacity: 1,
})

globalStyle(`${selectNoBorderOuter} .island-select__single-value`, {
  color: theme.color.dark400,
  fontSize: 'small',
  lineHeight: '1.4',
})

globalStyle(`${selectNoBorderOuter} .island-select__multi-value__label`, {
  color: theme.color.dark400,
  fontSize: 'small',
})
