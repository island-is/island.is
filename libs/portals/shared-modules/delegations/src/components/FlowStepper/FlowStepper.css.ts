import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const flowStepper = style({
  boxShadow: '0px 4px 30px 0px rgba(0, 97, 255, 0.08)',
  borderRadius: 8,
  overflow: 'hidden',
})

export const progressContainer = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
})

export const progress = style({
  position: 'relative',
  marginBottom: 28,
})

export const stepCircle = style({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  zIndex: 1,
})

export const stepCircleActive = style({
  backgroundColor: theme.color.blue400,
})

export const stepCircleCompleted = style({
  backgroundColor: theme.color.blue400,
})

export const stepCircleInactive = style({
  backgroundColor: theme.color.blue200,
})

export const stepName = style({
  position: 'absolute',
  top: 44,
  textAlign: 'center',
  whiteSpace: 'nowrap',
})

export const backgroundLine = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: 'var(--line-inset)',
  right: 'var(--line-inset)',
  height: 2,
  backgroundColor: theme.color.blue200,
  zIndex: 0,

  '::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 'var(--progress)',
    backgroundColor: theme.color.blue400,
    transition: 'width 0.2s ease',
  },
})
