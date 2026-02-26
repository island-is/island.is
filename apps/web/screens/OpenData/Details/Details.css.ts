import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  borderRadius: '8px',
  ':after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    pointerEvents: 'none',
    borderRadius: 6,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 0,
  },
})

export const searchInput = style({
  paddingRight: 96,
  height: 58,
  fontSize: 24,
  background: theme.color.blue100,
  fontWeight: theme.typography.light,
  border: 'none',
  outline: 'none',
  width: '100%',
})

export const searchIcon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 46,
  transform: 'translateY(-50%)',
  outline: 0,
  selectors: {
    '&::before': {
      content: '',
      zIndex: -1,
      left: -10,
      right: -10,
      top: -10,
      bottom: -10,
      borderRadius: 5,
      position: 'absolute',
      cursor: 'pointer',
      backgroundColor: theme.color.white,
      borderColor: theme.color.blue200,
      borderStyle: 'solid',
      borderWidth: 1,
      transition: `opacity 150ms ease`,
    },
  },
})

export const iconButton = style({
  margin: '0 7px',
})

export const gridContainer = style({
  padding: `0`,
})

export const mainContentWrapper = style({
  ...themeUtils.responsiveStyle({
    xl: {
      marginLeft: '110px',
    },
  }),
})

export const filterWrapper = style({
  width: 'unset',
  ...themeUtils.responsiveStyle({
    lg: {
      width: '320px',
    },
  }),
})

export const tagActive = style({
  color: `${theme.color.white} !important`,
  backgroundColor: `${theme.color.blue400} !important`,
})

export const tagNotActive = style({
  color: `${theme.color.blue400} !important`,
  backgroundColor: `${theme.color.blue100} !important`,
  ':hover': {
    textDecoration: 'none',
    backgroundColor: `${theme.color.blue400} !important`,
    color: `${theme.color.white} !important`,
  },
})

export const icon = style({
  minWidth: 30,
  width: 40,
  maxHeight: 40,
  ...themeUtils.responsiveStyle({
    md: {
      minWidth: 40,
    },
  }),
})

export const closeIcon = style({
  minWidth: 15,
  width: 25,
  height: 25,
})

export const removeButton = style({
  lineHeight: 0.75,
})

export const filterTagRow = style({
  minHeight: '40px',
  marginBottom: '18px',
  marginTop: '24px',
})

export const filterInput = style({
  ...themeUtils.responsiveStyle({
    md: {
      width: '480px',
    },
  }),
})

export const capitalizeText = style({
  display: 'block',
  selectors: {
    '&:first-letter': {
      textTransform: 'uppercase',
    },
  },
})

export const courseTypeIcon = style({
  borderRadius: 50,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 5,
  selectors: {
    '&.large': {
      height: '27px',
      width: '27px',
    },
    '&.small': {
      height: '21px',
      width: '21px',
    },
    '&.blue': {
      backgroundColor: `${theme.color.blue100}`,
    },
    '&.red': {
      backgroundColor: `${theme.color.red100}`,
    },
    '&.purple': {
      backgroundColor: `${theme.color.purple100}`,
    },
  },
})

export const courseListContainer = style({
  display: 'flex',
  padding: '2rem 0rem',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#F6F6FD',
  marginBottom: '24px',
})

export const courseListContentContainer = style({
  display: 'flex',
  padding: '0rem 2rem',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '1rem',
})

export const courseListItems = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
})

export const searchResultIcon = style({
  height: '24px',
})

export const heroImage = style({
  maxWidth: '200px',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '280px',
    },
  }),
})
