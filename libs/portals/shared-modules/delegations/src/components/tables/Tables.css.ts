import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { recipe } from '@vanilla-extract/recipes'

export const tableContainer = style({})

globalStyle(`${tableContainer} > div`, {
  overflow: 'visible',
})

export const mobileContainer = recipe({
  base: {
    '::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      left: `-${theme.spacing[2]}px`,
      right: `-${theme.spacing[2]}px`,

      borderBottom: `1px solid ${theme.color.blue200}`,
    },
  },
  variants: {
    isExpanded: {
      true: {
        '::before': {
          background: theme.color.blue100,
        },
      },
    },
  },
})

export const mobileDivider = style({
  '::after': {
    content: '',
    position: 'absolute',
    bottom: `-${theme.spacing[3]}px`,
    left: `-${theme.spacing[2]}px`,
    right: `-${theme.spacing[2]}px`,
    height: '1px',
    background: theme.color.blue200,
  },
})

export const buttonContainer = style({
  gap: theme.spacing[2],
  display: 'flex',
  marginBottom: theme.spacing[1],
})

export const link = style({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  color: theme.color.blue400,
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue400}`,
  ':hover': {
    color: theme.color.blueberry400,
    boxShadow: `inset 0 -1px 0 0 ${theme.color.blueberry400}`,
  },
})

export const linkMobile = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing[1],
  color: theme.color.blue400,
  border: `1px solid ${theme.color.blue400}`,
  borderRadius: 8,
  padding: '10px 16px',
  ':hover': {
    color: theme.color.blueberry400,
    borderColor: theme.color.blueberry400,
    borderWidth: 2,
  },
})
