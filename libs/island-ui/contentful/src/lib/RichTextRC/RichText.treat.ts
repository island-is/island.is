import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const orderedList = style({
  counterReset: 'section',
  marginTop: 14,
  marginBottom: 14,
  selectors: {
    'ol &': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

export const unorderedList = style({
  listStyle: 'none',
  marginTop: 14,
  marginBottom: 14,
  selectors: {
    'ul &': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

export const listItem = style({
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
      marginTop: 14,
    },
    '&:not(:last-child), ul ul &:last-child, ol ol &:last-child': {
      marginBottom: 14,
    },
  },
})

export const paragraph = style({
  selectors: {
    'p + &': {
      marginTop: 14,
    },
    [`${listItem} &`]: {
      marginBottom: 0,
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
