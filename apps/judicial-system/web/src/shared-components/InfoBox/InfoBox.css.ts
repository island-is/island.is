import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const infoBoxContainer = style({
  maxWidth: '440px',
  padding: theme.spacing[2],
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})

export const fluid = style({
  maxWidth: '100%',
})

export const light = style({
  background: theme.color.white,
})

export const trashButton = style({
  display: 'flex',
  padding: '8px',
  margin: '-8px',
  borderRadius: theme.border.radius.standard,
  transition: 'background-color .3s ease-in-out',

  selectors: {
    '&:hover, &:focus': {
      backgroundColor: theme.color.blue200,
    },
  },
})
