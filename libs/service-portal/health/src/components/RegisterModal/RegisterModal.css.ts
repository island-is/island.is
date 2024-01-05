import { style } from '@vanilla-extract/css'

export const modalBaseStyle = style({
  maxWidth: '55.5rem',
  position: 'absolute',
  width: 'calc(100% - 2rem)',
  inset: '1rem',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})

export const modalGridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 4fr 3fr',
})

export const modalGridContentStyle = style({
  gridColumnStart: 2,
})

export const modalGridImageStyle = style({
  placeSelf: 'center',
})

export const closeModalButtonStyle = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  cursor: 'pointer',
})

export const modalGridButtonGroup = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '1.5rem',
})
