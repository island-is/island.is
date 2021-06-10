import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

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
        },
        'ol ol &': {
          paddingLeft: theme.spacing[3],
        },
        'ol &:before': {
          float: 'left',
          margin: `2px 12px 0 0`,
          counterIncrement: 'section',
          content: 'counters(section, ".") " "',
          color: theme.color.red400,
          fontWeight: theme.typography.semiBold,
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
