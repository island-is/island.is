import { defineMessage } from 'react-intl'

// Strings on signed verdict overview screen
export const caseFilesAccordion = {
  title: defineMessage({
    id: 'judicial.system.core:case_files_accordion.title',
    defaultMessage: 'Rannsóknargögn ({fileCount})',
    description:
      'Notaður sem titill yfir rannsóknargögn í harmoiku hluta í yfirliti.',
  }),
  allFilesUploadedToCourtText: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.all_files_uploaded_to_court_text',
    defaultMessage: 'Gögn hafa verið vistuð í Auði',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að tekist hafi að vista öll gögn í Auði á yfirlitsskjá afgreiddra mála.',
  }),
  someFilesNotUploadedToCourtText: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.some_files_not_uploaded_to_court_text',
    defaultMessage: 'Ekki tókst að vista öll gögn í Auði',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að ekki hafi tekist að vista öll gögn í Auði á yfirlitsskjá afgreiddra mála.',
  }),
  uploadToCourtButtonText: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.upload_to_court_button_text',
    defaultMessage: 'Vista gögn í Auði',
    description:
      'Notaður sem texti í "Hlaða upp gögnum í Auði" takkanum á yfirlitsskjá afgreiddra mála.',
  }),
  retryUploadToCourtButtonText: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.retry_upload_to_court_button_text',
    defaultMessage: 'Reyna aftur',
    description:
      'Notaður sem texti í "Hlaða upp gögnum í Auði" takkanum á yfirlitsskjá afgreiddra mála ef ekki tókst að hlaða upp öllum skjölunum.',
  }),
  uploadToCourtAllBrokenText: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.upload_to_court_all_broken_text',
    defaultMessage:
      'Ofangreind rannsóknargögn eru ekki lengur aðgengileg í Réttarvörslugátt.',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að rannsóknargögn eru ekki aðgengileg í Réttarvörslugátt.',
  }),
}
