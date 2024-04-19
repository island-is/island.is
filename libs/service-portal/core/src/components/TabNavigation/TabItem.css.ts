import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const subTab = style({
  backgroundColor: 'transparent',
  ':hover': {
    backgroundColor: theme.color.white,
  },
})

export const alternativeTabItem = style({
  selectors: {
    '&:first-child': {
      borderLeft: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

export const tab = style({
  height: '100%',
  width: '100%',
  position: 'relative',
  minHeight: `${theme.spacing[7]}px`,
  fontWeight: theme.typography.light,
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.color.transparent}`,
  ':hover': {
    color: theme.color.blue400,
    borderColor: theme.color.transparent,
    borderBottomColor: theme.color.blue400,
  },
})

export const tabSelected = style({
  fontWeight: theme.typography.semiBold,
  color: theme.color.blue400,
  borderBottom: theme.color.transparent,
  background: `linear-gradient(180deg, ${theme.color.transparent} 50%, ${theme.color.white} 50%)`,
  '::after': {
    backgroundColor: theme.color.white,
    position: 'absolute',
    content: '',
    top: 0,
    left: 0,
    height: '50%',
    width: '100%',
    border: `1px solid ${theme.color.blue200}`,
    borderBottom: 'none',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
})

export const tabNotSelected = style({
  borderBottomColor: theme.color.blue200,
  selectors: {
    [`&:not(:has(+ ${tabSelected})):not(:last-of-type):after`]: {
      content: '""',
      position: 'absolute',
      width: 1,
      margin: `${theme.spacing[1]}px 0`,
      backgroundColor: theme.color.blue200,
      top: 0,
      bottom: 0,
      right: -1,
      zIndex: theme.zIndex.above,
    },
    [`&:has(+ ${tabSelected})`]: {
      borderColor: 'transparent',
    },
    [`${tabSelected} + &`]: {
      borderColor: 'transparent',
    },
  },
})

export const tabText = style({
  zIndex: theme.zIndex.above,
})

globalStyle(`${tabSelected}:not(:last-of-type) span:after`, {
  position: 'absolute',
  content: '',
  right: 'calc(-100% - 3px)',
  bottom: 0,
  height: '60%',
  width: 'calc(100% + 4px)',
  border: `1px solid ${theme.color.blue200}`,
  borderRight: 'none',
  borderTop: 'none',
  borderBottomLeftRadius: 10,
  pointerEvents: 'none',
})

globalStyle(`${tabSelected}:last-of-type span:after`, {
  position: 'absolute',
  content: '',
  right: 'calc(-100% - 3px)',
  bottom: 0,
  height: '60%',
  width: 'calc(100% + 4px)',
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 'none',
  borderBottom: 'none',
  pointerEvents: 'none',
})

globalStyle(`${tabSelected}:first-of-type span:before`, {
  position: 'absolute',
  content: '',
  left: 'calc(-100% - 3px)',
  bottom: 0,
  height: '60%',
  width: 'calc(100% + 4px)',
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 'none',
  borderBottom: 'none',
  pointerEvents: 'none',
})

globalStyle(`${tabSelected}:not(:first-of-type) span:before`, {
  position: 'absolute',
  content: '',
  left: 'calc(-100% - 3px)',
  bottom: 0,
  height: '60%',
  width: 'calc(100% + 4px)',
  border: `1px solid ${theme.color.blue200}`,
  borderLeft: 'none',
  borderTop: 'none',
  borderBottomRightRadius: 10,
  pointerEvents: 'none',
})
