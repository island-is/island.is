import { defineMessages } from 'react-intl'

export const defender = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.defender.title',
    defaultMessage: 'Verjendur',
    description:
      'Notaður sem titill á síðu á verjendur skrefi í dómaraflæði í ákærum.',
  },
  alertBannerText: {
    id: 'judicial.system.core:court_indictments.defender.alert_banner_text',
    defaultMessage:
      'Skipaðir verjendur í sakamálum fá tilkynningu um skipan í tölvupósti en fá ekki afhent málsgögn í gegnum Réttarvörslugátt eins og er.',
    description:
      'Notaður sem texti í alert banner á málflytjendurskjá í ákærum.',
  },
  selectDefenderHeading: {
    id:
      'judicial.system.core:court_indictments.defender.select_defender_heading',
    defaultMessage: 'Skipaður verjandi',
    description: 'Notaður sem texti fyrir val á skipaðan verjanda í ákærum.',
  },
  defendantWaivesRightToCounsel: {
    id:
      'judicial.system.core:court_indictments.defender.defendant_waives_right_to_counsel',
    defaultMessage: '{accused} óskar ekki eftir að sér sé skipaður verjandi',
    description:
      'Notaður sem texti fyrir takka þegar ákærðu óska ekki eftir verjanda í dómaraflæði í ákærum. ',
  },
  nextButtonText: {
    id: 'judicial.system.core:court_indictments.defender.next_button_text',
    defaultMessage: 'Senda tilkynningar',
    description:
      'Notaður sem texti á áfram takka á málflytjendurskjá í dómaraflæði í ákærum.',
  },
})
