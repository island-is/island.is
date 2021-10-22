import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 112,
  // padding: `0 ${theme.spacing[3]}px`,
  // '@media': {
  //   [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
  //     padding: `0 ${theme.spacing[6]}px`,
  //   },
  // },
})

export const headerTextWrapper = style({
  marginTop: '5px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderLeft: `2px solid ${theme.color.purple100}`,
    },
  },
})

export const headerDiviter = style({
  display: 'inline-block',
  height: '19px',
  width: '2px',
  backgroundColor: theme.color.dark200,
  margin: `5px ${theme.spacing[3]}px 0 ${theme.spacing[3]}px`,
})

export const islandIsApplicationLogoWrapper = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
    },
  },
})

export const islandIsApplicationLogoIconWrapper = style({
  display: 'flex',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const userProfileImage = style({
  width: `${theme.spacing[3]}px`,
  marginRight: `${theme.spacing[1]}px`,
})

export const desktopText = style({
  display: 'block',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const mobileText = style({
  display: 'block',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const dropdownMenuWrapper = style({
  zIndex: 10,
})
