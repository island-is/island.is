import { defineMessages } from 'react-intl'

export const strings = defineMessages({
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
  civilClaimants: {
    id: 'judicial.system.core:court_indictments.defender.civil_claimants',
    defaultMessage: 'Kröfuhafar',
    description:
      'Notaður sem titill á texta um kröfuhafa í dómaraflæði í ákærum.',
  },
  shareFilesWithCivilClaimantAdvocate: {
    id: 'judicial.system.core:court_indictments.defender.civil_claimant_share_files_with_advocate',
    defaultMessage:
      'Deila gögnum með {defenderIsLawyer, select, true {lögmanni} other {réttargæslumanni}} kröfuhafa',
    description: 'Notaður sem texti á deila kröfum með kröfuhafa takka.',
  },
  shareFilesWithCivilClaimantAdvocateTooltip: {
    id: 'judicial.system.core:court_indictments.defender.civil_claimant_share_files_with_advocate_tooltip',
    defaultMessage:
      'Ef hakað er í þennan reit fær {defenderIsLawyer, select, true {lögmaður} other {réttargæslumaður}} kröfuhafa aðgang að gögnum málsins',
    description:
      'Notaður sem texti í tooltip á deila kröfum með kröfuhafa takka.',
  },
  lawyer: {
    id: 'judicial.system.core:court_indictments.defender.lawyer',
    defaultMessage: 'Lögmaður',
    description: 'Notaður sem texti fyrir lögmann í dómaraflæði í ákærum.',
  },
  legalRightsProtector: {
    id: 'judicial.system.core:court_indictments.defender.legal_rights_protector',
    defaultMessage: 'Réttargæslumaður',
    description:
      'Notaður sem texti fyrir réttargæslumann í dómaraflæði í ákærum.',
  },
})
