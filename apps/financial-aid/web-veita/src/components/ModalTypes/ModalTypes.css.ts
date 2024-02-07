import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const activeState = style({
  color: theme.color.blue400,
  cursor: 'initial',
})

export const statusOptions = style({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  paddingLeft: theme.spacing[3],
  paddingBottom: theme.spacing[2],
  paddingTop: theme.spacing[2],
  borderRadius: '12px',
  fontWeight: 'lighter',
  transition: 'background-color ease 250ms, font-weight ease 50ms',
  selectors: {
    [`&:not(${activeState}):hover`]: {
      backgroundColor: theme.color.blue100,
      fontWeight: 'bold',
    },
  },
})

export const deductionFactor = style({
  display: 'grid',
  gridTemplateColumns: 'auto auto max-content',
  columnGap: theme.spacing[3],
  alignItems: 'center',
  marginBottom: theme.spacing[2],
})

export const textAreaEditable = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: '100%',
  padding: theme.spacing[2],
  paddingTop: theme.spacing[5],
  borderRadius: theme.spacing[1],
  minHeight: '225px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  fontSize: '18px',
  fontWeight: 300,
  lineHeight: 1.5,
  ':focus': {
    outline: 'none',
  },
  '::before': {
    content: 'Skilaboð til umsækjanda',
    display: 'block',
    position: 'absolute',
    color: theme.color.blue400,
    fontSize: '14px',
    marginTop: -theme.spacing[4],
    marginLeft: -theme.spacing[1],
    fontWeight: 600,
    lineHeight: 1.5,
  },
})
