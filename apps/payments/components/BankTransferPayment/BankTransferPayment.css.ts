import { globalStyle, style } from '@vanilla-extract/css'

// The design sizes the bank and ledger inputs equally and the account input 1.6× wider; as flex
// ratios so the row scales down on narrow screens.
export const bankAccountPart = style({
  flex: '1 1 0',
  minWidth: 0,
})

export const bankAccountNumberPart = style({
  flex: '1.6 1 0',
  minWidth: 0,
})

// The narrow inputs need their right padding to fit all their digits, as on the my-pages bank
// account form.
globalStyle(`${bankAccountPart} input`, {
  paddingRight: 0,
})
