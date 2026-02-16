import { globalStyle, style } from '@vanilla-extract/css'

import { regulationContentStyling } from '@island.is/regulations/styling'

export const departmentDate = style({
  marginTop: '3.5em',
  textAlign: 'center',
})

export const advertDescription = style({
  width: '90%',
  margin: '0 auto',
})

export const bodyText = style({
  marginTop: '1.6em',
})

export const hideSignature = style({})
globalStyle(`${hideSignature} .signature__date`, {
  display: 'none',
})

regulationContentStyling(bodyText)

globalStyle(
  `
    .section__title em,
    .section__title i,
    .chapter__title em,
    .chapter__title i,
    .subchapter__title em,
    .subchapter__title i,
    .article__title em,
    .article__title i`,
  {
    display: 'block',
  },
)
