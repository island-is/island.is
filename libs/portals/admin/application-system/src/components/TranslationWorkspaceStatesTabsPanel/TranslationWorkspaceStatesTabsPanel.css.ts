import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tabsPanelRoot = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: theme.color.white,
})

export const tabList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexShrink: 0,
  width: '100%',
  height: `${theme.spacing[5]}px`,
  overflow: 'visible',
})

const tabListBorder = theme.border.width.large

export const tab = style({
  flex: '1 1 0%',
  minWidth: 0,
  height: `calc(100% + ${tabListBorder * 2}px)`,
  marginTop: -tabListBorder,
  marginBottom: -tabListBorder,
  padding: 0,
  border: `${theme.border.width.standard}px solid ${theme.color.transparent}`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  appearance: 'none',
  selectors: {
    '&:first-child': {
      marginLeft: -tabListBorder,
    },
    '&:last-child': {
      marginRight: -tabListBorder,
    },
    '&:hover': {
      backgroundColor: theme.color.white,
      borderColor: theme.color.blue100,
    },
    '&:focus': {
      outline: `2px solid ${theme.color.blue400}`,
      outlineOffset: -2,
      zIndex: 1,
    },
  },
})

export const tabSelected = style({
  backgroundColor: theme.color.white,
  borderColor: theme.color.blue200,
  selectors: {
    '&:hover': {
      borderColor: theme.color.blue200,
    },
  },
})

export const tabPanel = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0%',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
})

export const tabsPanelScroll = style({
  flex: 1,
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
})

export const tabsPanelInner = style({
  minWidth: 0,
  maxWidth: '100%',
  overflowWrap: 'break-word',
  paddingTop: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  paddingBottom: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      paddingTop: theme.spacing[6],
      paddingLeft: theme.spacing[6],
      paddingRight: theme.spacing[6],
    },
  },
})
