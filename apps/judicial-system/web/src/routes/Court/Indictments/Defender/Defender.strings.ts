import { defineMessages } from 'react-intl'

export const defender = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.defender.title_v1',
    defaultMessage: 'Verjandi',
    description:
      'Notaður sem titill á síðu á verjenda skrefi í dómaraflæði í ákærum.',
  },
  alertBannerText: {
    id: 'judicial.system.core:court_indictments.defender.alert_banner_text_v1',
    defaultMessage:
      'Verjendur í sakamálum fá tilkynningu um skráningu í tölvupósti, aðgang að gögnum málsins og boð í þingfestingu.',
    description:
      'Notaður sem texti í alert banner á málflytjendurskjá í ákærum.',
  },
  selectDefenderHeading: {
    id: 'judicial.system.core:court_indictments.defender.select_defender_heading_v1',
    defaultMessage: 'Verjandi',
    description: 'Notaður sem texti fyrir val á skipaðan verjanda í ákærum.',
  },
  defendantWaivesRightToCounsel: {
    id: 'judicial.system.core:court_indictments.defender.defendant_waives_right_to_counsel',
    defaultMessage: '{accused} óskar ekki eftir að sér sé skipaður verjandi',
    description:
      'Notaður sem texti fyrir takka þegar ákærðu óska ekki eftir verjanda í dómaraflæði í ákærum. ',
  },
})
