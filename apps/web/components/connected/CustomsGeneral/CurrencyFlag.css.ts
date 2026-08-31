import { style, styleVariants } from '@vanilla-extract/css'

import {
  CURRENCY_FLAG_SIZE,
  CURRENCY_FLAG_SPRITE,
  currencyFlagIndex,
} from './currencyFlags'

export const flag = style({
  display: 'inline-block',
  width: CURRENCY_FLAG_SIZE,
  height: CURRENCY_FLAG_SIZE,
  verticalAlign: 'middle',
  backgroundImage: `url(${CURRENCY_FLAG_SPRITE})`,
  backgroundRepeat: 'no-repeat',
})

export const flagPosition = styleVariants(currencyFlagIndex, (index) => ({
  backgroundPosition: `0 -${index * CURRENCY_FLAG_SIZE}px`,
}))
