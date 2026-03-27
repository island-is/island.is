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
