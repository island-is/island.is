import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const scaleContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(44px, 1fr))',
})

export const scaleInput = style({})

export const scaleButton = style({
  height: '80px',
  minWidth: '44px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRight: '0.5px solid',
  borderLeft: '0.5px solid',
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: theme.color.blue200,
  backgroundColor: theme.color.blue100,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue400,
      cursor: 'pointer',
      borderColor: theme.color.blue400,
    },
    [`${scaleInput}:focus-visible + &`]: {
      position: 'relative',
      zIndex: 1,
    },
    [`${scaleInput}:disabled + &`]: {
      cursor: 'not-allowed',
      opacity: 0.5,
      pointerEvents: 'none',
      backgroundColor: 'transparent',
      borderColor: theme.color.blue200,
    },
    '&:first-of-type': {
      borderTopLeftRadius: theme.border.radius.large,
      borderBottomLeftRadius: theme.border.radius.large,
      borderLeft: '1px solid',
      borderColor: theme.color.blue200,
    },
    '&:first-of-type:hover': {
      borderColor: theme.color.blue400,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.border.radius.large,
      borderBottomRightRadius: theme.border.radius.large,
      borderRight: '1px solid',
      borderColor: theme.color.blue200,
    },
    '&:last-of-type:hover': {
      borderColor: theme.color.blue400,
    },
  },
})

export const scaleButtonSelected = style({
  border: '1px solid',
  borderColor: theme.color.blue400,
  backgroundColor: theme.color.blue400,
  selectors: {
    '&:first-of-type': {
      borderColor: theme.color.blue400,
    },
    '&:last-of-type': {
      borderColor: theme.color.blue400,
    },
    '&:hover': {
      backgroundColor: theme.color.blue400,
      border: '1px solid',
      cursor: 'pointer',
      borderColor: theme.color.blue400,
    },
    [`${scaleInput}:disabled + &`]: {
      borderColor: theme.color.blue400,
      backgroundColor: theme.color.blue400,
    },
  },
})

export const scaleButtonError = style({
  borderColor: theme.color.red600,
  selectors: {
    '&:hover': {
      borderColor: theme.color.red600,
    },
    '&:first-of-type': {
      borderColor: theme.color.red600,
    },
    '&:first-of-type:hover': {
      borderColor: theme.color.red600,
    },
    '&:last-of-type': {
      borderColor: theme.color.red600,
    },
    '&:last-of-type:hover': {
      borderColor: theme.color.red600,
    },
    [`${scaleButtonSelected}&`]: {
      borderColor: theme.color.red600,
    },
  },
})

export const scaleButtonText = style({
  color: theme.color.dark400,
  fontWeight: theme.typography.light,
  textAlign: 'center',
  selectors: {
    [`${scaleButtonSelected} &`]: {
      color: theme.color.white,
      fontWeight: theme.typography.semiBold,
    },
    [`${scaleButton}:hover &`]: {
      color: theme.color.white,
    },
    [`${scaleInput}:disabled + ${scaleButton} &`]: {
      color: theme.color.dark400,
    },
    [`${scaleInput}:disabled + ${scaleButtonSelected} &`]: {
      color: theme.color.white,
    },
  },
})
