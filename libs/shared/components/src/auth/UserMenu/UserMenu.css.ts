import { style } from 'treat'
import { spacing, theme, themeUtils } from '@island.is/island-ui/theme'

export const dropdown = style({
  position: 'fixed',
  top: spacing[3],
  right: spacing[3],
  left: spacing[3],

  maxHeight: `calc(100vh - ${spacing[6]}px)`,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',

  ...themeUtils.responsiveStyle({
    md: {
      left: 'auto',
      right: 'auto',
      width: 358,
    },
  }),
})

export const closeButton = style({
  display: 'flex',
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
    backgroundColor: theme.color.dark100,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
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
})

export const actorName = style({
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: theme.typography.regular,
})
