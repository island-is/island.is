import { style, globalStyle } from 'treat'
import {
  regulationContentStyling,
  diffStyling,
  regulationTitleStyling,
} from '@island.is/regulations/styling'
import { theme, spacing } from '@island.is/island-ui/theme'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'
const { color, typography, border, shadows } = theme

export const scrolled = style({})

export const breadCrumbs = style({
  position: 'sticky',
  top: 0,
  zIndex: 2,
})

globalStyle(`${scrolled} ${breadCrumbs} nav > div:not(:last-child)`, {
  position: 'absolute',
  zIndex: -1,
  opacity: 0.000001,
})

export const statusHeader = style({
  position: 'sticky',
  zIndex: 1,
  top: 0,
  marginTop: -spacing[3] - 4,
  paddingTop: spacing[3] + 4,
  paddingBottom: spacing[2],
  backgroundColor: color.white,

  selectors: {
    [`${scrolled} &`]: {
      transition: 'all 600ms 50ms ease-in',
      marginLeft: -spacing[2],
      marginRight: -spacing[2],
      paddingLeft: spacing[2],
      paddingRight: spacing[2],
      borderBottom: '1px solid ' + color.dark200,
      boxShadow: '0 20px 20px -20px  rgba(28, 28, 28, .15)',
    },
  },

  '@media': {
    print: {
      position: 'relative',
      marginTop: 0,
      paddingTop: 0,
      paddingBottom: spacing[1],
    },
  },
})

export const diffInfo = style({
  marginTop: spacing[1],
  fontSize: '.75em',
  // color: color.dark300,
  opacity: 0.67,
})

export const historyStepper = style({
  position: 'relative',
  top: spacing[1],
  marginTop: spacing[1],
  fontSize: '.75em',
  display: 'flex',
  flexFlow: 'row-reverse',
})
export const historyStepperLink = style({
  selectors: {
    '&:not(:first-child)': {
      marginRight: spacing[2],
    },
  },
})
export const historyStepperLinkText = style({
  display: 'inline-block',
  verticalAlign: 'top',
})

const makeWatermark = (text: string, size = 1, opacity = 1) => {
  const fontSize = size * 200
  opacity *= 0.0575
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 773 499' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E text %7B fill: rgba(0, 0, 0, ${opacity}); font-family: Calibri, sans-serif; font-weight: 700; font-size: ${fontSize}px; letter-spacing: -0.03em; text-anchor: middle; dominant-baseline: central; %7D %3C/style%3E%3Ctext x='50%25' y='50%25' transform='rotate(-38, 386, 250)'%3E${text}%3C/text%3E%3C/svg%3E%0A")`
}

export const repealedWarning = style({
  backgroundImage: makeWatermark('Brottfelld', 0.9),
  backgroundSize: '100% auto',
  backgroundPosition: 'top center',
})
export const oudatedWarning = style({
  backgroundImage: makeWatermark('Úrelt', 1, 0.6),
  backgroundSize: '100% auto',
  backgroundPosition: 'top center',
})
export const upcomingWarning = style({
  backgroundImage: makeWatermark('Framtíðar', 0.75),
})

// ---------------------------------------------------------------------------

export const diffText = style({})
export const titleText = style({})
export const bodyText = style({})

regulationContentStyling(bodyText)
regulationTitleStyling(titleText)
diffStyling(diffText)

// ---------------------------------------------------------------------------

export const disclaimer = style({
  // …
})
export const disclaimerParagraph = style({
  fontSize: 16,
  lineHeight: typography.baseLineHeight,

  selectors: {
    '&:not(:first-child)': {
      marginTop: theme.spacing[2],
    },
  },
})

// ---------------------------------------------------------------------------

export const sidebarScroller = style({
  overflowY: 'auto',
  // maxHeight: 'calc(100vh - var(--FixedNav-height-spaced))',
  maxHeight: `calc(100vh - ${STICKY_NAV_HEIGHT + spacing[1]}px)`,
  paddingBottom: spacing[4],
})
