import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

import { BLEED_AMOUNT } from '../../../components/ServiceWeb/constants'

export const categories = style({
  overflow: 'hidden',
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  top: -BLEED_AMOUNT,
  marginBottom: -BLEED_AMOUNT,
})

export const faqs = style({
  position: 'relative',
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  borderRadius: theme.border.radius.large,
})
