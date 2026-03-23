import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const mobileMediaQuery = `screen and (max-width: ${theme.breakpoints.md - 1}px)`

export { heading, description, listContainer } from '../shared/listingPageStyles.css'

export const filterBar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: 24,
  columnGap: 16,
})

export const searchContainer = style({
  width: 300,
  maxWidth: '100%',
  '@media': {
    [mobileMediaQuery]: {
      flex: '1 1 0',
      width: 'auto',
    },
  },
})

export const radioGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginLeft: 'auto',
  '@media': {
    [mobileMediaQuery]: {
      order: 3,
      width: '100%',
      justifyContent: 'space-between',
      marginLeft: 0,
    },
  },
})

export const filterButton = style({
  flexShrink: 0,
  flexGrow: 0,
})
