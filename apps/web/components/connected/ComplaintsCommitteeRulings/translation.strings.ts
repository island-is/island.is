import { defineMessages } from 'react-intl'

export const m = defineMessages({
  seeMoreRulings: {
    id: 'web.complaintsCommitteeRulings:seeMoreRulings',
    defaultMessage: 'Sjá fleiri úrskurði',
    description: 'Sjá fleiri úrskurði',
  },
  yearLabel: {
    id: 'web.complaintsCommitteeRulings:yearLabel',
    defaultMessage: 'Ár',
    description: 'Year filter label',
  },
  yearPlaceholder: {
    id: 'web.complaintsCommitteeRulings:yearPlaceholder',
    defaultMessage: 'Veldu ár',
    description: 'Year filter placeholder',
  },
  noRulingsFound: {
    id: 'web.complaintsCommitteeRulings:noRulingsFound',
    defaultMessage: 'Engir úrskurðir fundust fyrir valin skilyrði.',
    description: 'No rulings found message',
  },
  openPdf: {
    id: 'web.complaintsCommitteeRulings:openPdf',
    defaultMessage: 'Opna PDF',
    description: 'Open PDF button label',
  },
  errorLoadingRulings: {
    id: 'web.complaintsCommitteeRulings:errorLoadingRulings',
    defaultMessage: 'Villa kom upp við að sækja úrskurði. Vinsamlegast reyndu aftur síðar.',
    description: 'Error message when rulings fail to load',
  },
})
