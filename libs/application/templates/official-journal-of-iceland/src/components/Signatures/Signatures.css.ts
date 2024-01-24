import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

const spacing = theme.spacing[2]
export const tabWrapper = style({
  paddingTop: spacing * 2,
  background: theme.color.white,
})

export const wrapper = style({
  width: '100%',
  padding: spacing,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
})

export const signatureGroupWrapper = style({})

export const signatureGroup = style({
  display: 'flex',
  gap: spacing,
  flexWrap: 'wrap',
  marginBottom: spacing,
  justifyContent: 'flexStart',
})

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: spacing,
})

export const inputWrapper = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: spacing,
})

export const removeInputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
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

globalStyle(`${signatureGroupWrapper} + ${signatureGroupWrapper}`, {
  position: 'relative',
  marginTop: spacing * 4,
})

globalStyle(`${signatureGroupWrapper} + ${signatureGroupWrapper}::before`, {
  content: '',
  position: 'absolute',
  top: -spacing * 2,
  left: 0,
  width: '100%',
  height: 1,
  backgroundColor: theme.color.blue200,
})
