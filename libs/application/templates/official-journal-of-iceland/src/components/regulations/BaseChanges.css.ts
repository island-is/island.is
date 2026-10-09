import { style } from '@vanilla-extract/css'
import {
  regulationContentStyling,
  diffStyling,
} from '@island.is/regulations/styling'

export const diff = style({})
regulationContentStyling(diff)
diffStyling(diff)

export const appendix = style({
  marginTop: '2rem',
  paddingTop: '1rem',
  borderTop: '1px solid #dedede',
})

export const appendixTitle = style({
  marginBottom: '0.5em',
  fontSize: '1.5em',
  fontWeight: 700,
})
