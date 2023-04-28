import { defineMessages } from 'react-intl'

export const courtOfAppealOverview = defineMessages({
  alertBannerLinkText: {
    id: 'judicial.system.core:court_of_appeal_overview.alert_banner_link_text',
    defaultMessage: 'Senda tilkynningu um móttöku',
    description: 'Texti í link á tilkynningu um móttöku kæru',
  },
  alertBannerTooltip: {
    id: 'judicial.system.core:court_of_appeal_overview.alert_banner_tooltip',
    defaultMessage:
      'Tilkynning um móttöku kæru og frest til að skila greinargerð sendist á Landsrétt og aðila málsins',
    description: 'Texti í tooltip á tilkynningu um móttöku kæru',
  },
  title: {
    id: 'judicial.system.core:court_of_appeal_overview.title',
    defaultMessage: 'Gæsluvarðhald virkt',
    description: 'Titill á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  appealFilesTitle: {
    id: 'judicial.system.core:court_of_appeal_overview.appeal_files_title',
    defaultMessage: 'Skjöl kærumáls',
    description:
      'Titill á skjöl kærumáls hlutanum á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  courtCaseFilesTitle: {
    id: 'judicial.system.core:court_of_appeal_overview.court_case_files_title',
    defaultMessage: 'Skjöl héraðsdómsmáls',
    description:
      'Titill á skjöl héraðsdómsmáls hlutanum á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  unsignedDocument: {
    id: 'judicial.system.core:court_of_appeal_overview.unsigned_document',
    defaultMessage: 'Bíður undirritunar',
    description:
      'Notaður sem texti fyrir óundirritað í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  },
})
