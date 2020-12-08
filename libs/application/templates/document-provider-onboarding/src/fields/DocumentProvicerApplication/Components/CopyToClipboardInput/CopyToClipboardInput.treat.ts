import { style } from 'treat'

export const clipboardContainer = style({
  top: '50%',
  right: '16px',
  transform: 'translateY(-50%)',
})

export const inputWrapper = style({
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
})

export const testStyle = style({
  ':hover': {
    border: 'solid',
  },
  selectors: {
    [`&:focus`]: {
      borderColor: 'dark100',
    },
  },
})
