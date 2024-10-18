import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.advocates.title',
    defaultMessage: 'Verjandi',
    description:
      'Notaður sem titill á síðu á verjenda skrefi í dómaraflæði í ákærum.',
  },
  alertBannerText: {
    id: 'judicial.system.core:court_indictments.advocates.alert_banner_text',
    defaultMessage:
      'Verjendur í sakamálum fá tilkynningu um skráningu í tölvupósti, aðgang að gögnum málsins og boð í þingfestingu.',
    description:
      'Notaður sem texti í alert banner á málflytjendurskjá í ákærum.',
  },
  selectDefenderHeading: {
    id: 'judicial.system.core:court_indictments.advocates.select_defender_heading',
    defaultMessage: 'Verjandi',
    description: 'Notaður sem texti fyrir val á skipaðan verjanda í ákærum.',
  },
  defendantWaivesRightToCounsel: {
    id: 'judicial.system.core:court_indictments.advocates.defendant_waives_right_to_counsel',
    defaultMessage: '{accused} óskar ekki eftir að sér sé skipaður verjandi',
    description:
      'Notaður sem texti fyrir takka þegar ákærðu óska ekki eftir verjanda í dómaraflæði í ákærum. ',
  },
  civilClaimants: {
    id: 'judicial.system.core:court_indictments.advocates.civil_claimants',
    defaultMessage: 'Kröfuhafar',
    description:
      'Notaður sem titill á texta um kröfuhafa í dómaraflæði í ákærum.',
  },
  shareFilesWithCivilClaimantAdvocate: {
    id: 'judicial.system.core:court_indictments.advocates.civil_claimant_share_files_with_advocate',
    defaultMessage:
      'Deila gögnum með {defenderIsLawyer, select, true {lögmanni} other {réttargæslumanni}} kröfuhafa',
    description: 'Notaður sem texti á deila kröfum með kröfuhafa takka.',
  },
  shareFilesWithCivilClaimantAdvocateTooltip: {
    id: 'judicial.system.core:court_indictments.advocates.civil_claimant_share_files_with_advocate_tooltip',
    defaultMessage:
      'Ef hakað er í þennan reit fær {defenderIsLawyer, select, true {lögmaður} other {réttargæslumaður}} kröfuhafa aðgang að gögnum málsins',
    description:
      'Notaður sem texti í tooltip á deila kröfum með kröfuhafa takka.',
  },
  lawyer: {
    id: 'judicial.system.core:court_indictments.advocates.lawyer',
    defaultMessage: 'Lögmaður',
    description: 'Notaður sem texti fyrir lögmann í dómaraflæði í ákærum.',
  },
  legalRightsProtector: {
    id: 'judicial.system.core:court_indictments.advocates.legal_rights_protector',
    defaultMessage: 'Réttargæslumaður',
    description:
      'Notaður sem texti fyrir réttargæslumann í dómaraflæði í ákærum.',
  },
  removeCivilClaimantAdvocate: {
    id: 'judicial.system.core:court_indictments.advocates.remove_civil_claimant_advocate',
    defaultMessage:
      'Fjarlægja {defenderIsLawyer, select, true {lögmann} other {réttargæslumann}}',
    description:
      'Notaður sem texti fyrir eyða kröfuhafa í dómaraflæði í ákærum.',
  },
  addCivilClaimantAdvocate: {
    id: 'judicial.system.core:court_indictments.advocates.add_civil_claimant',
    defaultMessage: 'Bæta við lögmanni kröfuhafa',
    description:
      'Notaður sem texti fyrir bæta við kröfuhafa takka í dómaraflæði í ákærum.',
  },
  noCivilClaimantAdvocate: {
    id: 'judicial.system.core:court_indictments.advocates.no_civil_claimant_advocate',
    defaultMessage: 'Enginn lögmaður skráður',
    description:
      'Notaður sem texti þegar enginn lögmaður er skráður í dómaraflæði í ákærum.',
  },
  defenderChoiceAlertTitle: {
    id: 'judicial.system.core:court_indictments.advocates.defender_choice_alert_title',
    defaultMessage: 'Val á verjanda - {defendantName}',
    description:
      'Notaður sem texti þegar ákærði hefur valið verjanda í dómaraflæði í ákærum.',
  },
  defenderChoiceAlertMessage: {
    id: 'judicial.system.core:court_indictments.advocates.defender_choice_alert_message',
    defaultMessage:
      '{requestedDefenderChoice, select, WAIVE {Ég óska ekki eftir verjanda.} CHOOSE {Ég óska þess að valinn lögmaður verji skipaður verjandi minn: {requestedDefenderName} kt. {requestedDefenderNationalId}.} DELAY {Ég óska eftir fresti fram að þingfestingu til þess að tilnefna verjanda.} DELEGATE {Ég fel dómara málsins að tilnefna og skipa mér verjanda.} other {Ekkert valið.}}',
    description:
      'Notaður sem texti þegar ákærði hefur valið verjanda í dómaraflæði í ákærum.',
  },
})
