import { defineMessage, defineMessages } from '@formatjs/intl'

export const restrictionRequest = {
  heading: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.heading',
    defaultMessage: 'Krafa um {caseType}',
    description:
      'Notaður sem titill í kröfu PDF þar sem {caseType} er mála týpan og bætt er við sjálfkrafa í kóða',
  }),
  noDistrict: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.no_district',
    defaultMessage: 'Ekki skráð',
    description: 'Notaður sem texti þegar embætti er ekki skráð',
  }),
  baseInfo: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.heading',
      defaultMessage: 'Grunnupplýsingar',
      description:
        'Notaður sem texti fyrir titill fyrir grunnupplýsingar í kröfu PDF',
    },
    nationalId: {
      id:
        'judicial.system.backend:pdf.restriction_request.base_info.national_id',
      defaultMessage: 'Kennitala:',
      description: 'Notaður sem texti fyrir kennitölu í kröfu PDF',
    },
    fullName: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.full_name',
      defaultMessage: 'Fullt nafn:',
      description: 'Notaður sem texti fyrir fullt nafn í kröfu PDF',
    },
    gender: {
      id: 'judicial.system.backend:pdf.restriction_request.base_info.gender',
      defaultMessage: 'Kyn:',
      description: 'Notaður sem texti fyrir kyn í kröfu PDF',
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
      id:
        'judicial.system.backend:pdf.restriction_request.base_info.no_defender',
      defaultMessage: 'Hefur ekki verið skráður',
      description:
        'Notaður sem texti þegar enginn verjandi er skráður í kröfu PDF',
    },
  }),
  courtClaim: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.court_claim',
    defaultMessage: 'Dómkröfur',
    description: 'Notaður sem texti fyrir dómkröfur í kröfu PDF',
  }),
  lawsBroken: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.laws_broken',
    defaultMessage: 'Lagaákvæði sem brot varða við',
    description:
      'Notaður sem texti fyrir lagaákvæði sem brot varða við í kröfu PDF',
  }),
  legalBasis: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.legal_basis',
    defaultMessage: 'Lagaákvæði sem krafan er byggð á',
    description:
      'Notaður sem texti fyrir lagaákvæði sem krafan er byggð á í kröfu PDF',
  }),
  restrictions: defineMessage({
    id: 'judicial.system.backend:pdf.restriction_request.restrictions',
    defaultMessage: 'Takmarkanir og tilhögun {caseType}',
    description:
      'Notaður sem texti fyrir takmarkanir og tilhögun í kröfu PDF þar sem {caseType} mála týpan.',
  }),
  factsAndArguments: defineMessages({
    heading: {
      id:
        'judicial.system.backend:pdf.restriction_request.facts_and_arguments.heading',
      defaultMessage: 'Greinargerð um málsatvik og lagarök',
      description:
        'Notaður sem texti fyrir titill fyrir málsatvik og lagarök í kröfu PDF',
    },
    facts: {
      id:
        'judicial.system.backend:pdf.restriction_request.facts_and_arguments.facts',
      defaultMessage: 'Málsatvik',
      description: 'Notaður sem texti fyrir titill fyrir málsatvik í kröfu PDF',
    },
    arguments: {
      id:
        'judicial.system.backend:pdf.restriction_request.facts_and_arguments.arguments',
      defaultMessage: 'Lagarök',
      description: 'Notaður sem texti fyrir titill fyrir lagarök í kröfu PDF',
    },
  }),
}
