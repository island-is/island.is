import { defineMessages } from 'react-intl'

export const hearingArrangements = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.hearing_arrangements.title',
    defaultMessage: 'Þingfesting',
    description:
      'Notaður sem titill á síðu á Þingfesting skrefi í dómaraflæði í ákærum.',
  },
  selectProsecutorHeading: {
    id:
      'judicial.system.core:court_indictments.hearing_arrangements.select_prosecutor_heading',
    defaultMessage: 'Ákærandi sem mætir fyrir dóm',
    description:
      'Notaður sem texti fyrir val á ákæranda sem mætir fyrir dóm í dómaraflæði í ákærum.',
  },
  selectDefenderHeading: {
    id:
      'judicial.system.core:court_indictments.hearing_arrangements.select_defender_heading',
    defaultMessage: 'Skipaður verjandi',
    description: 'Notaður sem texti fyrir val á skipaðan verjanda í ákærum.',
  },
})
