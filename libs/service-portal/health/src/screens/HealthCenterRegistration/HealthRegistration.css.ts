import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const StrongStyle = style({
  marginRight: '0.5rem',
})

export const TableRowStyle = style({
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
})

export const SaveButtonWrapperStyle = recipe({
  base: {
    position: 'relative',
  },
  variants: {
    visible: {
      true: {
        opacity: 1,
        zIndex: 1,
      },
      false: {
        opacity: 0,
        zIndex: -1,
      },
    },
  },
})

export const ModalBaseStyle = style({
  maxWidth: '55.5rem',
  position: 'absolute',
  width: 'calc(100% - 2rem)',
  inset: '1rem',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})

export const ModalGridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 4fr 3fr',
})

export const ModalGridContentStyle = style({
  gridColumnStart: 2,
})

export const ModalGridImageStyle = style({
  placeSelf: 'center',
})

export const CloseModalButtonStyle = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  cursor: 'pointer',
})

export const ModalGridButtonGroup = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '1.5rem',
})

export const FilterWrapperStyle = style({
  width: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '50%',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      width: '33.33333%',
    },
  },
})
