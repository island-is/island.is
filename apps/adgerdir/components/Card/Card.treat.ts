import { style } from 'treat'

export const card = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#CCDFFF',
  transition: 'border-color 150ms ease',
  borderRadius: '5px',
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderColor: '#0061FF',
    textDecoration: 'none',
  },
  ':focus': {
    outline: 0,
  },
  ':before': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: '3px',
    borderColor: '#E1D5EC',
    borderRadius: '7px',
    outline: 0,
    top: '-4px',
    left: '-4px',
    bottom: '-4px',
    right: '-4px',
    opacity: 0,
    transition: 'opacity 150ms ease',
  },
  selectors: {
    [`&:focus:before`]: {
      border: '3px solid #00E4CA',
      opacity: 1,
      outline: 0,
    },
  },
})

export const focused = style({
  ':before': {
    border: '3px solid #00E4CA',
    opacity: 1,
    outline: 0,
  },
})
