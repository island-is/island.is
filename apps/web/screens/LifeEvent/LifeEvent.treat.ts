import { style, globalStyle } from 'treat'

export const content = style({})

// temporary hack because it is rediculously difficult to change the rendering
// of contentful rich text content at the moment
globalStyle(`${content} > div > div > h2`, {
  marginTop: 120,
})
