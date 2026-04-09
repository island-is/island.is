import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const belowMd = `screen and (max-width: ${theme.breakpoints.md - 1}px)`
const belowSm = `screen and (max-width: ${theme.breakpoints.sm - 1}px)`

export const flowStepper = style({
  boxShadow: '0px 4px 30px 0px rgba(0, 97, 255, 0.08)',
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  contain: 'inline-size',
  '@media': {
    [belowMd]: {
      marginInline: -24,
      width: '100vw',
      boxShadow: 'none',
      borderRadius: 0,
    },
    [belowSm]: {
      marginInline: -16,
    },
  },
})

export const progressContainer = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  overflow: 'auto',
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[2],
  paddingLeft: theme.spacing[4],
  paddingRight: theme.spacing[4],
  '@media': {
    [belowMd]: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 24,
      paddingRight: 24,
      // overflow: 'visible',
    },
  },
})

export const progress = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  position: 'relative',
  marginBottom: 28,
  minWidth: 'var(--steps-min-width)',
  '@media': {
    [belowMd]: {
      minWidth: 0,
      marginBottom: 0,
    },
  },
})

export const stepItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  gap: theme.spacing[1],
  '@media': {
    [belowMd]: {
      flexDirection: 'row',
      gap: 8,
      paddingRight: theme.spacing[3],
    },
  },
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
  '@media': {
    [belowMd]: {
      width: 32,
      height: 32,
      minWidth: 32,
    },
  },
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
  '@media': {
    [belowMd]: {
      position: 'static',
      textAlign: 'left',
    },
  },
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

  '@media': {
    [belowMd]: {
      display: 'none',
    },
  },
})
