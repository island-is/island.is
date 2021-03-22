import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  overflow: 'hidden',
})

export const alphabetButton = style({
  display: 'inline-flex',
  marginBottom: theme.spacing[1],
  marginRight: theme.spacing[1],
  fontSize: 18,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  color: theme.color.blue400,
  background: theme.color.white,
  width: 35,
  height: 35,
  transition: 'color .25s, background-color .25s',
  outline: 0,
  ':focus': {
    color: theme.color.white,
    backgroundColor: theme.color.blue400,
  },
  ':hover': {
    backgroundColor: theme.color.blue100,
  },
  selectors: {
    '&:focus:hover': {
      color: theme.color.white,
      backgroundColor: theme.color.blue400,
    },
  },
})

export const alphabetButtonSelected = style({
  color: theme.color.white,
  backgroundColor: theme.color.blue400,
})

export const alphabetList = style({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  justifyContent: 'space-between',
})
