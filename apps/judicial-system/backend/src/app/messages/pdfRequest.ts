import { defineMessage, defineMessages } from '@formatjs/intl'

export const request = {
  heading: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.heading',
    defaultMessage: 'Krafa um {caseType}',
    description:
      'Notaður sem titill í kröfu PDF þar sem {caseType} er mála týpan og bætt er við sjálfkrafa í kóða',
  }),
  policeCaseNumbers: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.police_case_numbers',
    defaultMessage: 'LÖKE málsnúmer',
    description: 'Notaður sem text fyrir LÖKE málsnúmer í kröfu PDF',
  }),
  noDistrict: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.no_district',
    defaultMessage: 'Ekki skráð',
    description: 'Notaður sem texti þegar embætti er ekki skráð',
  }),
  baseInfo: defineMessages({
    court: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.court',
      defaultMessage: 'Dómstóll:',
      description: 'Notaður sem texti fyrir dómstól í kröfu PDF',
    },
    nationalId: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.national_id',
      defaultMessage: 'Kennitala:',
      description: 'Notaður sem texti fyrir kennitölu í kröfu PDF',
    },
    dateOfBirth: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.date_of_birth',
      defaultMessage: 'Fæðingardagur:',
      description: 'Notaður sem texti fyrir fæðingardag í kröfu PDF',
    },
    fullName: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.full_name',
      defaultMessage: 'Fullt nafn:',
      description: 'Notaður sem texti fyrir fullt nafn í kröfu PDF',
    },
    address: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.address',
      defaultMessage: 'Lögheimili:',
      description: 'Notaður sem texti fyrir lögheimili í kröfu PDF',
    },
    defender: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.defender',
      defaultMessage: 'Verjandi sakbornings: {defenderName}',
      description:
        'Notaður sem texti fyrir verjanda sakbornings í kröfu PDF þar sem {defenderName} er verjandi: og er bætt við sjálfkrafa í kóða',
    },
    noDefender: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.no_defender',
      defaultMessage: 'Hefur ekki verið skráður',
      description:
        'Notaður sem texti þegar enginn verjandi er skráður í kröfu PDF',
    },
  }),
  description: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.restriction_request.description.heading',
      defaultMessage: 'Efni kröfu',
      description: 'Notaður sem texti fyrir titil fyrir efni kröfu í kröfu PDF',
    },
  }),
  demands: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.restriction_request.demands.heading',
      defaultMessage: 'Dómkröfur',
      description: 'Notaður sem texti fyrir titil fyrir dómkröfur í kröfu PDF',
    },
    noDemands: {
      id: 'judicial.system.backend:pdf.restriction_request.demands.no_demands',
      defaultMessage: 'Dómkröfur ekki skráðar',
      description:
        'Notaður sem texti þegar engar dómkröfur eru skráðar í kröfu PDF',
    },
  }),
  lawsBroken: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.restriction_request.laws_broken.heading',
      defaultMessage: 'Lagaákvæði sem brot varða við',
      description:
        'Notaður sem texti fyrir titil fyrir lagaákvæði sem brot varða við í kröfu PDF',
    },
    noLawsBroken: {
      id: 'judicial.system.backend:pdf.restriction_request.laws_broken.no_laws_broken',
      defaultMessage: 'Lagaákvæði ekki skráð',
      description:
        'Notaður sem texti þegar engin lagaákvæði eru skráðar í kröfu PDF',
    },
  }),
  legalBasis: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.restriction_request.legal_basis.heading',
      defaultMessage: 'Lagaákvæði sem krafan er byggð á',
      description:
        'Notaður sem texti fyrir lagaákvæði sem krafan er byggð á í kröfu PDF',
    },
    noLegalBasis: {
      id: 'judicial.system.backend:pdf.restriction_request.legal_basis.no_legal_basis',
      defaultMessage: 'Lagaákvæði ekki skráð',
      description:
        'Notaður sem texti þegar engin lagaákvæði eru skráðar í kröfu PDF',
    },
  }),
  requestProsecutorOnlySession: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.request_prosecutor_only_session',
    defaultMessage: 'Beiðni um dómþing að varnaraðila fjarstöddum',
    description:
      'Notaður sem texti fyrir beiðni um dómþing að varnaraðila fjarstöddum í kröfu PDF',
  }),
  factsAndArguments: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.restriction_request.facts_and_arguments.heading',
      defaultMessage: 'Greinargerð um málsatvik og lagarök',
      description:
        'Notaður sem texti fyrir titill fyrir málsatvik og lagarök í kröfu PDF',
    },
    facts: {
      id: 'judicial.system.backend:pdf.restriction_request.facts_and_arguments.facts',
      defaultMessage: 'Málsatvik',
      description: 'Notaður sem texti fyrir titill fyrir málsatvik í kröfu PDF',
    },
    arguments: {
      id: 'judicial.system.backend:pdf.restriction_request.facts_and_arguments.arguments',
      defaultMessage: 'Lagarök',
      description: 'Notaður sem texti fyrir titill fyrir lagarök í kröfu PDF',
    },
    noFacts: {
      id: 'judicial.system.backend:pdf.restriction_request.facts_and_arguments.no_facts',
      defaultMessage: 'Málsatvik ekki skráð',
      description:
        'Notaður sem texti þegar engin málsatvik eru skráða í kröfu PDF',
    },
    noArguments: {
      id: 'judicial.system.backend:pdf.restriction_request.facts_and_arguments.no_arguments',
      defaultMessage: 'Lagarök ekki skráð',
      description:
        'Notaður sem texti þegar engin lagarök eru skráða í kröfu PDF',
    },
  }),
  prosecutor: defineMessage({
    noProsecutor: {
      id: 'judicial.system.backend:pdf.restriction_request.prosecutor.noProsecutor',
      defaultMessage: 'Saksóknari ekki skráður',
      description:
        'Notaður sem texti þegar engin saksóknari er skráður í kröfu PDF',
    },
  }),
}
