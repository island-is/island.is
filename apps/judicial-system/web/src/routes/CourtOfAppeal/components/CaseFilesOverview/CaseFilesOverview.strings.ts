import { defineMessages } from 'react-intl'

export const courtOfAppealCaseFilesOverview = defineMessages({
  appealFilesTitle: {
    id:
      'judicial.system.core:court_of_appeal_case_files_overview.appeal_files_title',
    defaultMessage: 'Skjöl kærumáls',
    description:
      'Titill á skjöl kærumáls hlutanum á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  appealFilesCategory: {
    id:
      'judicial.system.core:court_of_appeal_case_files_overview.appeal_files_category',
    defaultMessage:
      '{filesCategory, select, true {Sækjandi } other {Varnaraðili }} lagði fram',
    description:
      'Titill á hver lagði skjöl kærumáls á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  courtCaseFilesTitle: {
    id:
      'judicial.system.core:court_of_appeal_case_files_overview.court_case_files_title',
    defaultMessage: 'Skjöl héraðsdómsmáls',
    description:
      'Titill á skjöl héraðsdómsmáls hlutanum á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  unsignedDocument: {
    id:
      'judicial.system.core:court_of_appeal_case_files_overview.unsigned_document',
    defaultMessage: 'Bíður undirritunar',
    description:
      'Notaður sem texti fyrir óundirritað í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  },
})
