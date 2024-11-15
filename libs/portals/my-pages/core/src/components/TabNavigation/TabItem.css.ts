import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const centerAbsolute = {
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
} as const

export const tab = style({
  height: '100%',
  width: '100%',
  position: 'relative',
  minHeight: `${theme.spacing[7]}px`,
  fontWeight: theme.typography.light,
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.color.white}`,
  ':focus': {
    zIndex: 5,
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
    content: '',
    height: '50%',
    width: 'calc(100% + 2px)',
    top: 0,
    border: `1px solid ${theme.color.blue200}`,
    borderBottom: 'none',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    pointerEvents: 'none',
  },
})

//Adjacent to selected tab underline
const adjacentTabAfterPseudo = {
  position: 'absolute',
  content: '',
  height: 'calc(50% + 1px)',
  width: '100%',
  bottom: -1,
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 'none',
  pointerEvents: 'none',
  zIndex: 3,
} as const

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

export const tabNotSelected = style({
  borderBottomColor: theme.color.blue200,
  selectors: {},
  ':hover': {
    borderBottomColor: theme.color.blue400,
  },
})

export const tabText = style({
  zIndex: theme.zIndex.above,
})

export const tabElement = style({})
export const borderElement = style({})

const unselectedTabUnderline = {
  position: 'absolute',
  content: '',
  height: '1px',
  width: '90%',
  bottom: -1,
  background: theme.color.blue400,
  zIndex: 5,
} as const

//Underlines when hovering unselected tabs
globalStyle(`${tabNextToSelectedTab}:hover ${borderElement}:after`, {
  ...centerAbsolute,
  ...unselectedTabUnderline,
})

globalStyle(`${tabPreviousToSelectedTab}:hover ${borderElement}:after`, {
  ...centerAbsolute,
  ...unselectedTabUnderline,
})

globalStyle(
  `${tabPreviousToSelectedTab}:first-of-type:hover ${borderElement}:after`,
  {
    ...unselectedTabUnderline,
    left: 0,
  },
)

globalStyle(
  `${tabNextToSelectedTab}:last-of-type:hover ${borderElement}:after`,
  {
    ...unselectedTabUnderline,
    right: 0,
  },
)

//For styling edges if selected first or last
const selectedTabBarEdge = {
  backgroundColor: theme.color.blue200,
  position: 'absolute',
  content: '',
  height: 'calc(50% + 1px)',
  width: '1px',
  bottom: 0,
} as const

globalStyle(`${tabSelected}:first-of-type span:before`, {
  ...selectedTabBarEdge,
  left: -1,
})

globalStyle(`${tabSelected}:last-of-type span:before`, {
  ...selectedTabBarEdge,
  right: -1,
})

// Globals for styling the corners of the selected tab
const cornerBase = {
  position: 'absolute',
  content: '',
  width: '10px',
  height: '10px',
  background: theme.color.white,
} as const

const topBase = {
  ...cornerBase,
  top: 0,
} as const

//top left if selected, block the background
globalStyle(`${tabSelected}:first-of-type ${tabElement}:after`, {
  ...topBase,
  left: 0,
})

//top right if selected, block the background
globalStyle(`${tabSelected}:last-of-type ${tabElement}:before`, {
  ...topBase,
  right: 0,
})

const squareBase = {
  ...cornerBase,
  bottom: 0,
} as const

//right square
globalStyle(`${tabPreviousToSelectedTab}:not(:last-of-type) span:after`, {
  ...squareBase,
  right: 0,
})

//left square
globalStyle(`${tabNextToSelectedTab}:not(:first-of-type) span:before`, {
  ...squareBase,
  left: 0,
})

const circleBase = {
  ...cornerBase,
  bottom: 0,
  width: '20px',
  height: '20px',
  borderRadius: '10px',
  background: theme.color.blue100,
  zIndex: 2,
} as const

//right circle
globalStyle(
  `${tabPreviousToSelectedTab}:not(:last-of-type) ${tabElement}:after`,
  {
    ...circleBase,
    right: 0,
  },
)

//left circle
globalStyle(
  `${tabNextToSelectedTab}:not(:first-of-type) ${tabElement}:before`,
  {
    ...circleBase,
    left: 0,
  },
)

const divider = {
  content: '',
  position: 'absolute',
  width: 1,
  margin: `${theme.spacing[1]}px 0`,
  backgroundColor: theme.color.blue200,
  top: 0,
  bottom: 0,
  right: `-${theme.spacing.smallGutter}px`,
  zIndex: theme.zIndex.above,
} as const

//Divider between not selected tabs (divider not adjacent to selected tab)
globalStyle(`${tabNotSelected}:not(:last-child) ${tabElement}:after`, divider)

globalStyle(
  `${tabNextToSelectedTab}:not(:last-child) ${tabElement}:after`,
  divider,
)

//Text color change on hover
const hoverText = {
  color: theme.color.blue600,
} as const

globalStyle(`${tabNotSelected}:hover span`, hoverText)

globalStyle(`${tabNextToSelectedTab}:hover span`, hoverText)

globalStyle(`${tabPreviousToSelectedTab}:hover span`, hoverText)
