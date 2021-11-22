import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const processContainer = style({
  minHeight: 'calc(100vh - 112px)',
})

export const formStepperContainer = style({
  position: 'sticky',
  top: theme.spacing[4],
})

export const processContent = style({
  minHeight: '644px',
  paddingTop: theme.spacing[10],
  paddingBottom: theme.spacing[5],
})

export const loadingWrapper = style({
  display: 'flex',
  height: 'calc(100vh - 168px)',
  alignItems: 'center',
  justifyContent: 'center',
})

export const link = style({
  textDecoration: 'underline',
})
