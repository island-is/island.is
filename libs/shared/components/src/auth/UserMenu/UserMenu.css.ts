import { globalStyle, style } from '@vanilla-extract/css'
import { spacing, theme, themeUtils } from '@island.is/island-ui/theme'
import { StyleWithSelectors } from '@vanilla-extract/css/dist/declarations/src/types'

export const container = style({
  top: theme.headerHeight.small,
  zIndex: theme.zIndex.belowHeader,
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
  overflowY: 'auto',

  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: 'unset',
      overflowY: 'unset',
      top: 'unset',
    },
  }),
})

const dropdownBase: StyleWithSelectors = {
  position: 'fixed',
  right: spacing[0],
  left: spacing[0],
  borderRadius: 'unset',
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
  height: '100vh',
}

const dropdownBaseMD: StyleWithSelectors = {
  top: spacing[3],
  width: 358,
  borderRadius: theme.border.radius.large,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',
  height: 'auto',
}

export const dropdown = style({
  ...dropdownBase,
  ...themeUtils.responsiveStyle({
    md: {
      ...dropdownBaseMD,
      left: 'auto',
      right: 'auto',
    },
  }),
})

export const fullScreen = style({
  ...dropdownBase,
  ...themeUtils.responsiveStyle({
    md: {
      ...dropdownBaseMD,
      left: 'auto',
      right: spacing[3],
    },
  }),
})

export const wrapper = style({
  maxHeight: `calc(100vh - ${spacing[12]}px)`,
})

export const closeButton = style({
  justifyContent: 'center',
  alignItems: 'center',

  position: 'absolute',
  top: spacing[1],
  right: spacing[1],
  zIndex: 20,

  width: 44,
  height: 44,

  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: theme.color.white,

  borderRadius: '100%',
  transition: 'background-color 250ms, border-color 250ms',

  ':hover': {
    backgroundColor: theme.color.blue100,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})

globalStyle(`${closeButton}:hover > svg`, {
  color: theme.color.blue400,
})

export const hr = style({
  marginTop: theme.spacing[2],
  marginBottom: theme.spacing[2],
  borderColor: theme.color.blue100,
  borderWidth: '1px 0 0',
  borderStyle: 'solid',
  width: '100%',
})

export const delegationsList = style({
  overflowY: 'auto',
  overflowX: 'hidden',
  flexShrink: 1,
  padding: '3px',
  margin: '-3px',
})

export const smallAvatar = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginRight: -theme.spacing.gutter,
    },
    sm: {
      marginRight: 'unset',
    },
  }),
})

export const resetButtonPadding = style({
  marginTop: '-16px',
  marginBottom: '-16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
})

export const delegationName = style({
  fontSize: '16px',
  lineHeight: '20px',

  ':hover': {
    textDecoration: 'none',
  },
})

export const actorText = style({
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
})

export const textWrapper = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const actorName = style({
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: theme.typography.regular,
})

export const breakWord = style({
  wordBreak: 'break-word',
})

export const dropdownItem = style({
  zIndex: theme.zIndex.above,
  width: 'fit-content',
  ':hover': {
    color: theme.color.blue400,
  },
})

export const accessAvatarSize = style({
  width: 32,
  height: 32,
})

export const companyIconSize = style({
  width: 40,
  height: 40,
})
export const userDelegationsText = style({
  fontSize: 16,
  lineHeight: '21px',
  fontWeight: theme.typography.semiBold,
  color: theme.color.dark400,
})

export const userTopicCardBox = style({
  height: 64,
  textAlign: 'left',
})

globalStyle(`${userTopicCardBox}:hover > ${userDelegationsText}`, {
  color: theme.color.blue400,
})
