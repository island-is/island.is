import { globalStyle, style } from '@vanilla-extract/css'

import { regulationContentStyling } from '@island.is/regulations/styling'

export const bodyText = style({})
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
