import { defineMessages } from 'react-intl'

export const courtOfAppealOverview = defineMessages({
  alertBannerTitle: {
    id: 'judicial.system.core:court_of_appeal_overview.alert_banner_title',
    defaultMessage: 'Úrskurður kærður',
    description: 'Title of the alert banner',
  },
  alertBannerMessage: {
    id: 'judicial.system.core:court_of_appeal_overview.alert_banner_message',
    defaultMessage: '{actor} hefur kært úrskurðinn {appealDate}',
    description: 'Message of the alert banner',
  },
  alertBannerLinkText: {
    id: 'judicial.system.core:court_of_appeal_overview.alert_banner_link_text',
    defaultMessage: 'Senda tilkynningu um móttöku',
    description: 'Link text of the alert banner',
  },
  alertBannerTooltip: {
    id: 'judicial.system.core:court_of_appeal_overview.alert_banner_tooltip',
    defaultMessage:
      'Tilkynning um móttöku kæru og frest til að skila greinargerð sendist á Landsrétt og aðila málsins',
    description: 'Tooltip of the alert banner',
  },
  title: {
    id: 'judicial.system.core:court_of_appeal_overview.title',
    defaultMessage: 'Gæsluvarðhald virkt',
    description: 'Title of the court of appeal overview page',
  },
  appealFilesTitle: {
    id: 'judicial.system.core:court_of_appeal_overview.appeal_files_title',
    defaultMessage: 'Skjöl kærumáls',
    description: 'Title of the appeal files section',
  },
  courtCaseFilesTitle: {
    id: 'judicial.system.core:court_of_appeal_overview.court_case_files_title',
    defaultMessage: 'Skjöl héraðsdómsmáls',
    description: 'Title of the court case files section',
  },
  unsignedDocument: {
    id: 'judicial.system.core:court_of_appeal_overview.unsigned_document',
    defaultMessage: 'Bíður undirritunar',
    description:
      'Notaður sem texti fyrir óundirritað í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  },
})
