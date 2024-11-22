import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const buttonStyle = style({
  backgroundColor: `${theme.color.blue100}`,
  padding: `${theme.spacing[3]}px ${theme.spacing[4]}px`,
  textAlign: 'left',
  width: '100%',
  borderRadius: `${theme.border.radius.default}`,
  outlineColor: `${theme.color.mint400}`,
  outlineWidth: 'thick',
  border: `1px solid ${theme.color.blue100}`,
  overflow: 'hidden',
  maxWidth: '430px',
  ':hover': {
    border: `1px solid ${theme.color.blue300}`,
    transition: 'all 0.2s ease-in-out',
  },
})

export const delegationContainer = style({
  maxWidth: '660px',
  margin: `0 auto ${theme.spacing[5]}px auto`,
  borderRadius: `${theme.border.radius.default}`,
  border: `1px solid ${theme.color.blue200}`,
  paddingBottom: `${theme.spacing[5]}px`,
})
