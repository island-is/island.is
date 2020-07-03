import { style } from 'treat'

export const container = style({
  outline: '1px solid brown',
  padding: 20,
})

export const month = style({})

export const year = style({})

export const event = style({
  outline: '1px solid blue',
  marginBottom: 20,
  ':last-child': {
    margin: 0,
  },
})

export const section = style({
  display: 'flex',
  padding: '20px 0',
  alignItems: 'center',
  flexDirection: 'row',
  outline: '1px solid black',
})

export const left = style({
  textAlign: 'right',
  outline: '1px solid red',
  width: 80,
})

export const right = style({
  flexGrow: 1,
  outline: '1px solid green',
})
