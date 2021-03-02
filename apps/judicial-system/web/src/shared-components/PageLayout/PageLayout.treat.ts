import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const processContainer = style({
  minHeight: 'calc(100vh - 112px)',
})

export const processContent = style({
  minHeight: '644px',
})

export const loadingWrapper = style({
  display: 'flex',
  height: 'calc(100vh - 168px)',
  alignItems: 'center',
  justifyContent: 'center',
})

export const link = style({
  textDecoration: 'underline',
  color: theme.color.blue400,
})
