import { defineMessages } from 'react-intl'

export const defendantParty = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.defendant_party.title',
    defaultMessage: 'Málflytjendur',
    description:
      'Notaður sem titill á síðu á Málflytjendur skrefi í dómaraflæði í ákærum.',
  },
  selectProsecutorHeading: {
    id:
      'judicial.system.core:court_indictments.defendant_party.select_prosecutor_heading',
    defaultMessage: 'Ákærandi sem mætir fyrir dóm',
    description:
      'Notaður sem texti fyrir val á ákæranda sem mætir fyrir dóm í dómaraflæði í ákærum.',
  },
  selectDefenderHeading: {
    id:
      'judicial.system.core:court_indictments.defendant_party.select_defender_heading',
    defaultMessage: 'Skipaður verjandi',
    description: 'Notaður sem texti fyrir val á skipaðan verjanda í ákærum.',
  },

  defendantRejectsHavingDefender: {
    id:
      'judicial.system.core:court_indictments.defendant_party.defendant_rejects_having_defender',
    defaultMessage: '{accused} óskar ekki eftir að sér sé skipaður verjandi',
    description:
      'Notaður sem texti fyrir takka þegar ákærðu óska ekki eftir verjanda í dómaraflæði í ákærum. ',
  },
})
