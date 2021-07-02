import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import {
  regulationEditingStyling,
  diffStyling,
} from '@island.is/regulations/styling'
const { color, typography, border } = theme

export const diffToggler = style({
  float: 'right',
  color: color.blue400,
  ':hover': {
    textDecoration: 'underline',
  },
})

const makeWatermark = (text: string, size = 1) => {
  const fontSize = size * 200
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 773 499' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E text %7B fill: rgba(0, 0, 0, 0.0575); font-family: Calibri, sans-serif; font-weight: 700; font-size: ${fontSize}px; letter-spacing: -0.03em; text-anchor: middle; dominant-baseline: central; %7D %3C/style%3E%3Ctext x='50%25' y='50%25' transform='rotate(-38, 386, 250)'%3E${text}%3C/text%3E%3C/svg%3E%0A")`
}

export const oudatedWarning = style({
  backgroundImage: makeWatermark('Úrelt'),
  backgroundSize: '100% auto',
  backgroundPosition: 'top center',
})
export const upcomingWarning = style({
  backgroundImage: makeWatermark('Framtíðar', 0.75),
})

// ---------------------------------------------------------------------------

export const bodyText = style({})

regulationEditingStyling(bodyText)
diffStyling(bodyText)
