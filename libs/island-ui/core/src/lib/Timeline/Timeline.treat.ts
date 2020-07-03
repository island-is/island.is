import { style } from 'treat'

export const container = style({
  position: 'relative',
  outline: '1px solid brown',
  margin: 20,
  ':before': {
    content: '""',
    position: 'absolute',
    width: 8,
    opacity: 0.5,
    top: 0,
    left: 96,
    bottom: 0,
    backgroundColor: 'blue',
  },
})

export const month = style({ fontSize: 13 })

export const year = style({})

export const event = style({
  outline: '1px solid blue',
  marginLeft: 91,
  marginBottom: 40,
  ':last-child': {
    marginBottom: 0,
  },
})

export const bulletLine = style({
  position: 'absolute',
  left: -12,
})

export const section = style({
  display: 'flex',
  padding: '20px 0',
  flexDirection: 'row',
  outline: '1px solid black',
})

export const left = style({
  textAlign: 'right',
  outline: '1px solid red',
  width: 100,
  paddingRight: 20,
})

export const right = style({
  position: 'relative',
  flexGrow: 1,
  outline: '1px solid green',
  paddingLeft: 20,
})
