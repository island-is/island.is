import { defineMessage } from 'react-intl'
import { defineMessages } from '@formatjs/intl'

export const core = {
  accused: defineMessage({
    id: 'judicial.system.backend:pdf.core.accused',
    defaultMessage: 'kærð{suffix}',
    description: 'Notað fyrir orðið kærði/a.',
  }),
  defendant: defineMessage({
    id: 'judicial.system.backend:pdf.core.defendant',
    defaultMessage: 'varnaraðil{suffix}',
    description: 'Notað fyrir orðið varnaraðili.',
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
