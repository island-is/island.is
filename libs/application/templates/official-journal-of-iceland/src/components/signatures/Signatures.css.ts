import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'

const spacing = theme.spacing[2]
export const tabWrapper = style({
  paddingTop: spacing * 2,
  background: theme.color.white,
})

export const signatureContainer = style({
  position: 'relative',
  marginBottom: spacing * 2,
  selectors: {
    '&:last-child': {
      marginBottom: 0,
    },
    '&::after': {
      content: '',
      position: 'absolute',
      width: '100%',
      bottom: -theme.spacing[3],
      left: 0,
      height: 1,
      backgroundColor: theme.color.blue200,
    },
    '&:last-child::after': {
      display: 'none',
    },
  },
})

export const signatureWrapper = style({
  paddingBlockStart: spacing,
  background: theme.color.white,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing,
})

export const wrapper = style({
  width: '100%',
  padding: spacing,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.default,
})

export const institutionWrapper = style({})

export const institution = style({
  display: 'flex',
  gap: spacing,

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      flexDirection: 'column',
    },
  },
})

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing,
})

export const committeeInputGroupWrapper = style({
  display: 'flex',
  flexDirection: 'column',
})

export const committeeInputGroup = style(
  {
    display: 'flex',
    flexDirection: 'column',
  },
  'committeeInputGroup',
)

export const committeInputWrapper = style(
  {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing,
    marginBottom: theme.spacing[2],
    paddingBottom: theme.spacing[2],
    borderBottom: `1px solid ${theme.color.blue200}`,
  },
  'committeInputWrapper',
)

export const committeInputWrapperLast = style(
  [
    committeInputWrapper,
    {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottom: 'none',
    },
  ],
  'committeInputWrapperLast',
)

export const inputWrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: spacing,
})

export const removeInputGroup = style({
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.default,
  display: 'flex',
  width: OJOI_INPUT_HEIGHT,
  height: OJOI_INPUT_HEIGHT,
  justifyContent: 'center',
  alignItems: 'center',
})

export const addSignatureWrapper = style({
  marginTop: spacing,
})

globalStyle(`${inputGroup} + ${inputGroup}`, {
  position: 'relative',
  marginTop: spacing * 2,
})

globalStyle(`${inputGroup} + ${inputGroup}::before`, {
  content: '',
  position: 'absolute',
  top: -spacing,
  left: 0,
  width: '100%',
  height: 1,
  backgroundColor: theme.color.blue200,
})

globalStyle(`${institutionWrapper} + ${institutionWrapper}`, {
  position: 'relative',
  marginTop: spacing * 4,
})

globalStyle(`${institutionWrapper} + ${institutionWrapper}::before`, {
  content: '',
  position: 'absolute',
  top: -spacing * 2,
  left: 0,
  width: '100%',
  height: 1,
  backgroundColor: theme.color.blue200,
})
