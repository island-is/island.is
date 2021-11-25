import { defineMessages } from '@formatjs/intl'

export const core = {
  missing: defineMessages({
    court: {
      id: 'judicial.system.backend:pdf.core.missing.court',
      defaultMessage: 'Dómstóll hefur ekki verið skráður',
      description: 'Notaður sem texti þegar dómstóll hefur ekki verið skráður.',
    },
    demands: {
      id: 'judicial.system.backend:pdf.core.missing.demands',
      defaultMessage: 'Krafa hefur ekki verið skráð.',
      description: 'Notaður sem texti þegar krafa hefur ekki verið skráð.',
    },
    litigationPresentations: {
      id: 'judicial.system.backend:pdf.core.missing.litigation_presentations',
      defaultMessage: 'Málflutningur hefur ekki verið skráður.',
      description:
        'Notaður sem texti þegar málflutningur hefur ekki verið skráður.',
    },
    caseFacts: {
      id: 'judicial.system.backend:pdf.core.missing.case_facts',
      defaultMessage: 'Málsatvik hafa ekki verið skráð.',
      description: 'Notaður sem texti þegar málsatvik hafa ekki verið skráð.',
    },
    legalArguments: {
      id: 'judicial.system.backend:pdf.core.missing.legal_arguments',
      defaultMessage: 'Lagarök hafa ekki verið skráð.',
      description: 'Notaður sem texti þegar lagarök hafa ekki verið skráð.',
    },
    conclusion: {
      id: 'judicial.system.backend:pdf.core.missing.conclusion',
      defaultMessage: 'Niðurstaða hefur ekki verið skráð.',
      description: 'Notaður sem texti þegar niðurstaða hefur ekki verið skráð.',
    },
    rulingText: {
      id: 'judicial.system.backend:pdf.core.missing.ruling_text',
      defaultMessage: 'Úrskurðarorð hafa ekki verið skráð.',
      description:
        'Notaður sem texti þegar úrskurðarorð hafa ekki verið skráð.',
    },
    judge: {
      id: 'judicial.system.backend:pdf.core.missing.judge',
      defaultMessage: 'Dómari hefur ekki verið skráður',
      description: 'Notaður sem texti þegar dómari hefur ekki verið skráður.',
    },
  }),
  caseType: defineMessages({
    custody: {
      id: 'judicial.system.backend:pdf.core.case_type.custody',
      defaultMessage: 'gæsluvarðhald',
      description:
        'Notaður sem texti fyrir týpu gæsluvarðhald á kröfu í kröfu PDF',
    },
    travelBan: {
      id: 'judicial.system.backend:pdf.core.case_type.travel_ban',
      defaultMessage: 'farbann',
      description: 'Notaður sem texti fyrir týpu farbann á kröfu í kröfu PDF',
    },
    investigate: {
      id: 'judicial.system.backend:pdf.core.case_type.investigate',
      defaultMessage: 'rannsóknarheimild',
      description:
        'Notaður sem texti fyrir týpu rannsóknarheimild á kröfu í kröfu PDF',
    },
  }),
}
