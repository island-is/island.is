import { defineMessages } from 'react-intl'

export const defentantParty = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.defentant_party.title',
    defaultMessage: 'Málflytjendur',
    description:
      'Notaður sem titill á síðu á Málflytjendur skrefi í dómaraflæði í ákærum.',
  },
  selectProsecutorHeading: {
    id:
      'judicial.system.core:court_indictments.defentant_party.select_prosecutor_heading',
    defaultMessage: 'Ákærandi sem mætir fyrir dóm',
    description:
      'Notaður sem texti fyrir val á ákæranda sem mætir fyrir dóm í dómaraflæði í ákærum.',
  },
  selectDefenderHeading: {
    id:
      'judicial.system.core:court_indictments.defentant_party.select_defender_heading',
    defaultMessage: 'Skipaður verjandi',
    description: 'Notaður sem texti fyrir val á skipaðan verjanda í ákærum.',
  },
})
