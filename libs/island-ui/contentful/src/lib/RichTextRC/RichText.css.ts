import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const orderedList = style({
  counterReset: 'section',
  marginTop: 16,
  marginBottom: 16,
  selectors: {
    'ol &': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

export const unorderedList = style({
  listStyle: 'none',
  marginTop: 16,
  marginBottom: 16,
  selectors: {
    'ul &': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

export const listItem = style({
  ...themeUtils.responsiveStyle({
    xs: {
      selectors: {
        'ol &': {
          listStyle: 'none',
          position: 'relative',
          paddingLeft: theme.spacing[3],
        },
        'ol ol &': {
          paddingLeft: theme.spacing[3],
        },
        'ol &:before': {
          position: 'absolute',
          top: '2px',
          left: '8px',
          counterIncrement: 'section',
          content: 'counters(section, ".") " "',
          color: theme.color.red400,
          fontWeight: theme.typography.semiBold,
          transform: 'translate(-100%, 0)',
        },
        'ul &': {
          position: 'relative',
          paddingLeft: theme.spacing[3],
        },
        'ul &:before': {
          content: '""',
          position: 'absolute',
          top: '10px',
          left: 0,
          borderRadius: '50%',
          border: `4px solid red`,
          counterIncrement: 'none',
          transform: 'none',
        },
        '&:not(:first-child), ul ul &:first-child, ol ol &:first-child': {
          marginTop: 12,
        },
        '&:not(:last-child), ul ul &:last-child, ol ol &:last-child': {
          marginBottom: 12,
        },
      },
    },
    md: {
      selectors: {
        '&:not(:first-child), ul ul &:first-child, ol ol &:first-child': {
          marginTop: 14,
        },
        '&:not(:last-child), ul ul &:last-child, ol ol &:last-child': {
          marginBottom: 14,
        },
      },
    },
  }),
})

export const paragraph = style({
  marginTop: 12,
  marginBottom: 12,
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: 14,
      marginBottom: 14,
    },
  }),
  selectors: {
    [`${listItem} &`]: {
      marginBottom: 0,
      marginTop: 0,
    },
  },
})

export const heading = style({
  selectors: {
    '&:first-child': {
      marginTop: 0,
    },
  },
})

export const clearBoth = style({
  clear: 'both',
})

// Table styles to override default table styles from island-ui/core when rendering tables from rich text content. See Figma for reference
export const tableContainer = style({})

globalStyle(`${tableContainer} th`, {
  padding: theme.spacing[2],
})

globalStyle(`${tableContainer} td`, {
  padding: `${theme.spacing.p5}px ${theme.spacing[2]}px`,
})

globalStyle(`${tableContainer} th p`, {
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: theme.typography.semiBold,
  margin: 0,
})

globalStyle(`${tableContainer} td p`, {
  margin: 0,
})
