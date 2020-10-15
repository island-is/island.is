import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const homeCard = style({
  width: 432,
  height: 174,
  padding: '24px 24px 24px 32px',
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
  },
})

export const homeCardMobile = style({
  width: 327,
  height: 162,
  padding: '16px 16px 16px 24px',
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
  },
})

export const cardTitle = style({
  color: theme.color.blue400,
  fontWeight: 600,
  marginBottom: '0.5rem',
})

export const cardText = style({
  textAlign: 'left',
  fontWeight: 300,
})
