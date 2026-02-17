import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const centerAbsolute = {
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
} as const

export const hidden = style({
  visibility: 'hidden',
})

export const tabPanel = style({
  outline: 0,
})

export const bg = style({
  position: 'absolute',
  top: '36px',
  bottom: 0,
  left: 0,
  right: 0,
  ...themeUtils.responsiveStyle({
    lg: {
      top: 0,
    },
  }),
})

// ============================================================================
// Tab List Styles
// ============================================================================

export const tabList = recipe({
  base: {
    height: 0,
    overflow: 'hidden',
    background: theme.color.blue100,
    position: 'relative',
    zIndex: theme.zIndex.base,
  },
  variants: {
    type: {
      default: {
        display: 'grid',
        gridAutoColumns: 'minmax(0, 1fr)',
        gridAutoFlow: 'column',
        width: '100%',
        borderRadius: `${theme.border.radius.large} ${theme.border.radius.large} 0 0`,
        borderColor: theme.border.color.blue100,
        borderWidth: theme.border.width.large,
      },
      alternative: {
        display: 'flex',
        width: 'fit-content',
        borderRadius: theme.border.radius.standard,
        borderColor: theme.border.color.blue100,
        borderWidth: theme.border.width.large,
      },
    },
    visible: {
      true: {
        overflow: 'initial',
      },
      false: {
        display: 'none',
      },
    },
  },
  compoundVariants: [
    {
      variants: { type: 'default', visible: true },
      style: { height: `${theme.spacing[8]}px` },
    },
    {
      variants: { type: 'alternative', visible: true },
      style: { height: `${theme.spacing[5]}px` },
    },
  ],
})

// ============================================================================
// Tab Styles (Default Variant)
// ============================================================================

export const tabDefault = recipe({
  base: {
    flexBasis: 0,
    height: '100%',
    flexGrow: 1,
    position: 'relative',
    fontWeight: theme.typography.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.color.white}`,
    ':focus': {
      zIndex: 5,
    },
  },
  variants: {
    state: {
      selected: {
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
      },
      notSelected: {
        color: theme.color.dark400,
        borderBottomColor: theme.color.blue200,
        ':hover': {
          borderBottomColor: theme.color.blue400,
        },
      },
      previousToSelected: {
        ':hover': {
          borderBottomColor: theme.color.white,
        },
        ':after': {
          position: 'absolute',
          content: '',
          height: 'calc(50% + 1px)',
          width: '100%',
          bottom: -1,
          border: `1px solid ${theme.color.blue200}`,
          borderTop: 'none',
          pointerEvents: 'none',
          zIndex: 3,
          borderBottomRightRadius: 10,
          borderLeft: 'none',
        },
      },
      nextToSelected: {
        ':hover': {
          borderBottomColor: theme.color.white,
        },
        ':after': {
          position: 'absolute',
          content: '',
          height: 'calc(50% + 1px)',
          width: '100%',
          bottom: -1,
          border: `1px solid ${theme.color.blue200}`,
          borderTop: 'none',
          pointerEvents: 'none',
          zIndex: 3,
          borderBottomLeftRadius: 10,
          borderRight: 'none',
        },
      },
    },
  },
})

// Keep individual class exports for globalStyle selectors that target pseudo-elements
// These cannot use recipe class names because globalStyle needs direct class references
export const tab = style({
  flexBasis: 0,
  height: '100%',
  flexGrow: 1,
  position: 'relative',
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

export const tabNotSelected = style({
  color: theme.color.dark400,
  borderBottomColor: theme.color.blue200,
  ':hover': {
    borderBottomColor: theme.color.blue400,
  },
})

export const tabPreviousToSelectedTab = style({
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    position: 'absolute',
    content: '',
    height: 'calc(50% + 1px)',
    width: '100%',
    bottom: -1,
    border: `1px solid ${theme.color.blue200}`,
    borderTop: 'none',
    pointerEvents: 'none',
    zIndex: 3,
    borderBottomRightRadius: 10,
    borderLeft: 'none',
  },
})

export const tabNextToSelectedTab = style({
  ':hover': {
    borderBottomColor: theme.color.white,
  },
  ':after': {
    position: 'absolute',
    content: '',
    height: 'calc(50% + 1px)',
    width: '100%',
    bottom: -1,
    border: `1px solid ${theme.color.blue200}`,
    borderTop: 'none',
    pointerEvents: 'none',
    zIndex: 3,
    borderBottomLeftRadius: 10,
    borderRight: 'none',
  },
})

// ============================================================================
// Tab Styles (Alternative Variant)
// ============================================================================

export const tabAlternative = recipe({
  base: {
    border: `${theme.border.radius.standard} solid ${theme.color.transparent}`,
    borderRadius: `${theme.border.radius.large}`,
    padding: `${theme.spacing[1]}px ${theme.spacing[3]}px`,
    margin: '-1px 0',
    selectors: {
      '&:first-child': {
        marginLeft: '-3px',
      },
      '&:last-child': {
        marginRight: '-3px',
      },
    },
  },
  variants: {
    state: {
      selected: {
        border: `1px solid ${theme.color.blue200}`,
        borderRadius: theme.border.radius.standard,
        backgroundColor: theme.color.white,
      },
      notSelected: {
        ':hover': {
          backgroundColor: 'white',
          borderColor: theme.color.blue100,
        },
      },
    },
    showDivider: {
      true: {
        selectors: {
          '&:not(:last-child):after': {
            content: '""',
            position: 'absolute',
            width: 1,
            margin: `${theme.spacing[1]}px 0`,
            backgroundColor: theme.color.blue200,
            top: 0,
            bottom: 0,
            right: `-${theme.spacing.smallGutter}px`,
            zIndex: theme.zIndex.above,
          },
        },
      },
      false: {},
    },
  },
})

// ============================================================================
// Utility Styles
// ============================================================================

export const tabText = style({
  padding: '0 8px',
  zIndex: theme.zIndex.aboveHeader,
  fontSize: '16px',
})

export const borderElement = style({})

const unselectedTabUnderline = {
  position: 'absolute',
  content: '',
  height: '1px',
  width: '90%',
  bottom: -1,
  background: theme.color.blue600,
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

// Globals for styling the corners of the selected tab

export const squareElement = style({})
export const circleElement = style({})

//For styling edges if selected first or last
const selectedTabBarEdge = {
  backgroundColor: theme.color.blue200,
  position: 'absolute',
  content: '',
  height: 'calc(50% + 1px)',
  width: '1px',
  bottom: 0,
} as const

const cornerBase = {
  position: 'absolute',
  content: '',
  width: '10px',
  height: '10px',
  background: theme.color.white,
} as const

const squareBase = {
  ...cornerBase,
  bottom: 0,
} as const

//right square
globalStyle(
  `${tabPreviousToSelectedTab}:not(:last-of-type) ${squareElement}:after`,
  {
    ...squareBase,
    right: 0,
  },
)

//left square
globalStyle(
  `${tabNextToSelectedTab}:not(:first-of-type) ${squareElement}:before`,
  {
    ...squareBase,
    left: 0,
  },
)

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
  `${tabPreviousToSelectedTab}:not(:last-of-type) ${circleElement}:after`,
  {
    ...circleBase,
    right: 0,
  },
)

//left circle
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

//Text color change on hover
const hoverText = {
  color: theme.color.blue600,
} as const

globalStyle(`${tabNotSelected}:hover ${tabText}`, hoverText)

globalStyle(`${tabNextToSelectedTab}:hover ${tabText}`, hoverText)

globalStyle(`${tabPreviousToSelectedTab}:hover ${tabText}`, hoverText)

const divider = {
  content: '',
  position: 'absolute',
  width: 1,
  margin: `12px 0`,
  backgroundColor: theme.color.blue200,
  top: 0,
  bottom: 0,
  right: `-${theme.spacing.smallGutter}px`,
  zIndex: theme.zIndex.above,
} as const

//Divider between not selected tabs (divider not adjacent to selected tab)
globalStyle(
  `${tabNotSelected}:not(:last-child) ${circleElement}:after`,
  divider,
)

globalStyle(
  `${tabNextToSelectedTab}:not(:last-child) ${circleElement}:after`,
  divider,
)
