import { defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const signedVerdictOverview = defineMessages({
  accusedAppealed: {
    id: 'judicial.system.core:signed_verdict_overview.accused_appealed',
    defaultMessage:
      '{genderedAccused} hefur kært úrskurðinn í þinghaldi sem lauk {courtEndTime}',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að kærði kærði úrskurðinn í þinghaldi á yfirlitsskjá afgreiddra mála.',
  },
  prosecutorAppealed: {
    id: 'judicial.system.core:signed_verdict_overview.prosecutor_appealed',
    defaultMessage:
      'Sækjandi hefur kært úrskurðinn í þinghaldi sem lauk {courtEndTime}',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að sækjandi kærði úrskurðinn í þinghaldi á yfirlitsskjá afgreiddra mála.',
  },
})
