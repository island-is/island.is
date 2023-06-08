import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  courtCaseFilesTitle: {
    id: 'judicial.system.core:court_of_appeal.case_files_overview.court_case_files_title',
    defaultMessage: 'Skjöl héraðsdómsmáls',
    description:
      'Titill á skjöl héraðsdómsmáls hlutanum á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  unsignedDocument: {
    id: 'judicial.system.core:court_of_appeal.case_files_overview.unsigned_document',
    defaultMessage: 'Bíður undirritunar',
    description:
      'Notaður sem texti fyrir óundirritað í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  },
})
