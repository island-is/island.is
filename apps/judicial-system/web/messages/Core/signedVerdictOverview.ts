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
  allFilesUploadedToCourtText: {
    id:
      'judicial.system.core:signed_verdict_overview.all_files_uploaded_to_court_text',
    defaultMessage: 'Gögn hafa verið vistuð í Auði',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að tekist hafi að vista öll gögn í Auði á yfirlitsskjá afgreiddra mála.',
  },
  someFilesUploadedToCourtText: {
    id:
      'judicial.system.core:signed_verdict_overview.some_files_uploaded_to_court_text',
    defaultMessage: 'Ekki tókst að vista öll gögn í Auði',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að ekki hafi tekist að vista öll gögn í Auði á yfirlitsskjá afgreiddra mála.',
  },
  uploadToCourtButtonText: {
    id:
      'judicial.system.core:signed_verdict_overview.upload_to_court_button_text',
    defaultMessage: 'Vista gögn í Auði',
    description:
      'Notaður sem texti í "Hlaða upp gögnum í Auði" takkanum á yfirlitsskjá afgreiddra mála.',
  },
  retryUploadToCourtButtonText: {
    id:
      'judicial.system.core:signed_verdict_overview.retry_upload_to_court_button_text',
    defaultMessage: 'Reyna aftur',
    description:
      'Notaður sem texti í "Hlaða upp gögnum í Auði" takkanum á yfirlitsskjá afgreiddra mála ef ekki tókst að hlaða upp öllum skjölunum.',
  },
  uploadToCourtAllBrokenText: {
    id:
      'judicial.system.core:signed_verdict_overview.upload_to_court_all_broken_text',
    defaultMessage:
      'Ofangreind rannsóknargögn eru ekki lengur aðgengileg í Réttarvörslugátt.',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að rannsóknargögn eru ekki aðgengileg í Réttarvörslugátt.',
  },
  dismissedTitle: {
    id: 'judicial.system.core:signed_verdict_overview.dismissed_title',
    defaultMessage: 'Kröfu vísað frá',
    description:
      'Notaður sem titill á yfirlitsskjá afgreiddra mála þegar máli er vísað frá.',
  },
  conclusionTitle: {
    id: 'judicial.system.core:signed_verdict_overview.conclusion_title',
    defaultMessage: 'Úrskurðarorð',
    description:
      'Notaður sem titill fyrir "Úrskurðarorð" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  },
})
