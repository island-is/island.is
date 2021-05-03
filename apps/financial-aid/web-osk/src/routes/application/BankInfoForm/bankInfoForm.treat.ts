import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const bankInformationContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  // '@media': {
  //   [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
  //     gridTemplateColumns: 'repeat(8, 1fr)',
  //   },
  // },
})

export const bankNumber = style({
  gridColumn: 'span 3',
})

export const accountNumber = style({
  gridColumn: 'span 4',
  // '@media': {
  //   [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
  //     gridColumn: 'span 4',
  //   },
  // },
})

// export const removeStepper = style({
//   margin: '0',
//   WebkitAppearance: 'none',
// })
