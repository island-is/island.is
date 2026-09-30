import { globalStyle, style } from '@vanilla-extract/css'
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

export const scopeToggleList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  width: '100%',
  height: `${theme.spacing[5]}px`,
  borderRadius: theme.border.radius.standard,
})

const scopeToggleBorder = theme.border.width.large

export const scopeToggleOption = style({
  flex: '1 1 0%',
  minWidth: 0,
  height: `calc(100% + ${scopeToggleBorder * 2}px)`,
  marginTop: -scopeToggleBorder,
  marginBottom: -scopeToggleBorder,
  padding: `0 ${theme.spacing[2]}px`,
  border: `${theme.border.width.standard}px solid ${theme.color.transparent}`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  appearance: 'none',
  selectors: {
    '&:first-child': {
      marginLeft: -scopeToggleBorder,
    },
    '&:last-child': {
      marginRight: -scopeToggleBorder,
    },
    '&:hover': {
      backgroundColor: theme.color.white,
      borderColor: theme.color.blue100,
    },
  },
})

export const scopeToggleOptionSelected = style({
  backgroundColor: theme.color.white,
  borderColor: theme.color.blue200,
  selectors: {
    '&:hover': {
      borderColor: theme.color.blue200,
    },
  },
})

export const tabList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexShrink: 0,
  width: '100%',
  height: `${theme.spacing[5]}px`,
  overflow: 'visible',
  position: 'relative',
  zIndex: theme.zIndex.base,
  borderRadius: `${theme.border.radius.large} ${theme.border.radius.large} 0 0`,
})

const tabListBorder = theme.border.width.large

export const tab = style({
  flex: '1 1 0%',
  minWidth: 0,
  position: 'relative',
  height: `calc(100% + ${tabListBorder * 2}px)`,
  marginTop: -tabListBorder,
  marginBottom: -tabListBorder,
  padding: 0,
  border: 'none',
  borderBottom: `1px solid ${theme.color.white}`,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  appearance: 'none',
  fontWeight: theme.typography.light,
  selectors: {
    '&:first-child': {
      marginLeft: -tabListBorder,
    },
    '&:last-child': {
      marginRight: -tabListBorder,
    },
    '&:focus': {
      outline: 'none',
      zIndex: 5,
    },
  },
})

export const tabSelected = style({
  fontWeight: theme.typography.semiBold,
  color: theme.color.blue400,
  background: `linear-gradient(180deg, ${theme.color.transparent} 50%, ${theme.color.white} 50%)`,
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    backgroundColor: theme.color.white,
    position: 'absolute',
    content: '""',
    height: '50%',
    width: 'calc(100% + 2px)',
    top: 0,
    left: -1,
    border: `1px solid ${theme.color.blue200}`,
    borderBottom: 'none',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    pointerEvents: 'none',
  },
})

export const tabNotSelected = style({
  color: theme.color.dark400,
  borderBottomColor: theme.color.blue200,
  ':hover': {
    borderBottomColor: theme.color.blue400,
  },
})

const adjacentTabAfterPseudo = {
  position: 'absolute',
  content: '""',
  height: 'calc(50% + 1px)',
  width: '100%',
  bottom: -1,
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 'none',
  pointerEvents: 'none',
  zIndex: 3,
} as const

export const tabPreviousToSelectedTab = style({
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    ...adjacentTabAfterPseudo,
    borderBottomRightRadius: 10,
    borderLeft: 'none',
  },
})

export const tabNextToSelectedTab = style({
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    ...adjacentTabAfterPseudo,
    borderBottomLeftRadius: 10,
    borderRight: 'none',
  },
})

export const tabText = style({
  padding: '0 8px',
  zIndex: theme.zIndex.aboveHeader,
  fontSize: '16px',
})

export const squareElement = style({})
export const circleElement = style({})

const selectedTabBarEdge = {
  backgroundColor: theme.color.blue200,
  position: 'absolute',
  content: '""',
  height: 'calc(50% + 1px)',
  width: '1px',
  bottom: 0,
} as const

const cornerBase = {
  position: 'absolute',
  content: '""',
  width: '10px',
  height: '10px',
  background: theme.color.white,
} as const

const squareBase = {
  ...cornerBase,
  bottom: 0,
} as const

const circleBase = {
  ...cornerBase,
  bottom: 0,
  width: '20px',
  height: '20px',
  borderRadius: '10px',
  background: theme.color.blue100,
  zIndex: 2,
} as const

// right square, next to the selected tab's left neighbour
globalStyle(
  `${tabPreviousToSelectedTab}:not(:last-of-type) ${squareElement}:after`,
  {
    ...squareBase,
    right: 0,
  },
)

// left square, next to the selected tab's right neighbour
globalStyle(
  `${tabNextToSelectedTab}:not(:first-of-type) ${squareElement}:before`,
  {
    ...squareBase,
    left: 0,
  },
)

// right circle notch
globalStyle(
  `${tabPreviousToSelectedTab}:not(:last-of-type) ${circleElement}:after`,
  {
    ...circleBase,
    right: 0,
  },
)

// left circle notch
globalStyle(
  `${tabNextToSelectedTab}:not(:first-of-type) ${circleElement}:before`,
  {
    ...circleBase,
    left: 0,
  },
)

globalStyle(`${tabSelected}:first-of-type ${squareElement}:before`, {
  ...selectedTabBarEdge,
  left: -1,
})

globalStyle(`${tabSelected}:last-of-type ${squareElement}:before`, {
  ...selectedTabBarEdge,
  right: -1,
})

globalStyle(`${tabNotSelected}:hover ${tabText}`, {
  color: theme.color.blue600,
})

globalStyle(`${tabNextToSelectedTab}:hover ${tabText}`, {
  color: theme.color.blue600,
})

globalStyle(`${tabPreviousToSelectedTab}:hover ${tabText}`, {
  color: theme.color.blue600,
})

// Divider between adjacent not-selected tabs
globalStyle(`${tabNotSelected}:not(:last-child) ${circleElement}:after`, {
  content: '""',
  position: 'absolute',
  width: 1,
  margin: '12px 0',
  backgroundColor: theme.color.blue200,
  top: 0,
  bottom: 0,
  right: `-${theme.spacing.smallGutter}px`,
  zIndex: theme.zIndex.above,
})

globalStyle(`${tabNextToSelectedTab}:not(:last-child) ${circleElement}:after`, {
  content: '""',
  position: 'absolute',
  width: 1,
  margin: '12px 0',
  backgroundColor: theme.color.blue200,
  top: 0,
  bottom: 0,
  right: `-${theme.spacing.smallGutter}px`,
  zIndex: theme.zIndex.above,
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

export const toggleButton = style({
  marginBottom: 0,
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

export const translateActionDisabled = style({
  selectors: {
    '&& button:disabled': {
      cursor: 'not-allowed',
    },
  },
})

export const translationLocaleInputLabel = style({
  selectors: {
    '&& label': {
      fontWeight: theme.typography.semiBold,
      color: theme.color.blue400,
      marginBottom: theme.spacing[1],
    },
  },
})
