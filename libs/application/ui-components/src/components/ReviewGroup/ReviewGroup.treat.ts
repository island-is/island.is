import { style } from 'treat'

export const hidden = style({
  position: 'absolute',

  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,

  overflow: 'hidden',
})
