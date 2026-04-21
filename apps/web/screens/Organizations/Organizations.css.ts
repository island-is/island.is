import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const mobileMediaQuery = `screen and (max-width: ${theme.breakpoints.md - 1}px)`

export {
  heading,
  description,
  listContainer,
} from '../shared/listingPageStyles.css'

export const filterBar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: 24,
  columnGap: 16,
  '@media': {
    [mobileMediaQuery]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const searchContainer = style({
  width: 300,
  maxWidth: '100%',
  '@media': {
    [mobileMediaQuery]: {
      width: '100%',
    },
  },
})

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  marginLeft: 'auto',
  '@media': {
    [mobileMediaQuery]: {
      marginLeft: 0,
    },
  },
})
