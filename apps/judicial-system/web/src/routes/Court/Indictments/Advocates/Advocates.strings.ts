import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:court_indictments.advocates.title',
    defaultMessage: 'Verjandi',
    description:
      'Notaður sem titill á síðu á verjenda skrefi í dómaraflæði í ákærum.',
  },
  defendantWaivesRightToCounsel: {
    id: 'judicial.system.core:court_indictments.advocates.defendant_waives_right_to_counsel',
    defaultMessage: '{accused} óskar ekki eftir að sér sé skipaður verjandi',
    description:
      'Notaður sem texti fyrir takka þegar ákærðu óska ekki eftir verjanda í dómaraflæði í ákærum. ',
  },
  confirmDefenderChoice: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_defender_choice_v1',
    defaultMessage: 'Staðfesta val',
    description:
      'Notaður sem texti fyrir takka til að staðfesta val á verjanda í dómaraflæði í ákærum.',
  },
  confirmSpokespersonChoice: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_spokesperson_choice',
    defaultMessage:
      'Staðfesta {spokespersonIsLawyer, select, true {lögmann} other {réttargæslumann}}',
    description:
      'Notaður sem texti fyrir takka til að staðfesta val á talsmanni í dómaraflæði í ákærum.',
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
  confirmDefenderChoiceModalTitle: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_defender_choice_modal_title_v2',
    defaultMessage:
      '{isDefenderChoiceConfirmed, select, true {Breyta} other {Staðfesta}}',
    description:
      'Notaður sem titill á staðfesta eða breyta val á verjanda modal í dómaraflæði í ákærum.',
  },
  confirmDefenderChoiceModalText: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_defender_choice_modal_text_v1',
    defaultMessage:
      'Valinn verjandi, {defenderName}, mun fá aðgang að málinu í Réttarvörslugátt. ',
    description:
      'Notaður sem texti í staðfesta val á verjanda modal í dómaraflæði í ákærum.',
  },
  confirmDefenderWaivedModalText: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_defender_waived_modal_text',
    defaultMessage: 'Ákærða verður ekki skipaður verjandi.',
    description:
      'Notaður sem texti í staðfesta val á verjanda modal í dómaraflæði í ákærum.',
  },
  confirmDefenderDelayModalText: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_defender_delay_modal_text_v1',
    defaultMessage:
      'Ákærði fær frest fram að þingfestingu til að tilnefna verjanda.',
    description:
      'Notaður sem texti í staðfesta val á verjanda modal í dómaraflæði í ákærum.',
  },
  changeDefenderChoiceModalText: {
    id: 'judicial.system.core:court_indictments.advocates.change_defender_choice_modal_text',
    defaultMessage: 'Ertu viss um að þú viljir breyta vali á verjanda?',
    description:
      'Notaður sem texti í breyta vali á verjanda modal í dómaraflæði í ákærum.',
  },
  confirmSpokespersonModalTitle: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_spokesperson_modal_title_v1',
    defaultMessage:
      '{isSpokespersonConfirmed, select, true {Breyta vali} other {Staðfesta val}} á {spokespersonIsLawyer, select, true {lögmanni} other {réttargæslumanni}}',
    description:
      'Notaður sem titill á staðfesta val á lögmanni eða réttargæslumanni modal í dómaraflæði í ákærum.',
  },
  confirmSpokespersonModalText: {
    id: 'judicial.system.core:court_indictments.advocates.confirm_spokesperson_modal_text',
    defaultMessage:
      'Ertu viss um að þú viljir {isSpokespersonConfirmed, select, true {breyta vali} other {staðfesta val}} á {spokespersonIsLawyer, select, true {lögmanni} other {réttargæslumanni}}?',
    description:
      'Notaður sem texti í staðfesta val á lögmanni eða réttargæslumanni modal í dómaraflæði í ákærum.',
  },
  confirmModalPrimaryButtonText: {
    id: 'judicial.system.core:court_indictments.advocates.modal_primary_button_text_v2',
    defaultMessage:
      '{isConfirming, select, true {Staðfesta val} other {Breyta}}',
    description:
      'Notaður sem texti á takka til að staðfesta val á lögmanni eða réttargæslumanni í dómaraflæði í ákærum.',
  },
  confirmModalSecondaryButtonText: {
    id: 'judicial.system.core:court_indictments.advocates.modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á takka til að hætta við val á lögmanni eða réttargæslumanni í dómaraflæði í ákærum.',
  },
  shareFilesWithDefender: {
    id: 'judicial.system.core:court_indictments.advocates.share_files_with_defender',
    defaultMessage: 'Deila gögnum með verjanda',
    description: 'Notaður sem texti á deila kröfum með verjanda takka.',
  },
  shareFilesWithDefenderTooltip: {
    id: 'judicial.system.core:court_indictments.advocates.share_files_with_defender_tooltip',
    defaultMessage:
      'Ef hakað er í þennan reit fær lögmaður aðgang að gögnum málsins',
    description:
      'Notaður sem texti í tooltip á deila kröfum með verjanda takka.',
  },
})
