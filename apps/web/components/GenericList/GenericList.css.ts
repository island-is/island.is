import { style } from '@vanilla-extract/css'

export const clickableItemTopRowContainer = style({
  minHeight: '30px',
})

export const filterTagsContainer = style({
  minHeight: '32px',
})

export const yearFilter = style({
  width: '160px',
  flexShrink: 0,
})

// The filter menu stacks its children with a larger gap than the gap between filter categories,
// pull the next category up so the section lines up with the categories below it
export const filterMenuSection = style({
  marginBottom: -32,
})
