import { style } from '@vanilla-extract/css'

// A min height from the CMS transfers through the aspect ratio of the report
// into a min width, which would otherwise push it out of its container
export const embed = style({
  maxWidth: '100%',
})
