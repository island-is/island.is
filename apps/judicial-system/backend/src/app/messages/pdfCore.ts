import { defineMessages } from '@formatjs/intl'
import { defineMessage } from 'react-intl'

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
    admissionToFacility: {
      id: 'judicial.system.backend:pdf.core.case_type.admission_to_facility',
      defaultMessage: 'vistun á viðeigandi stofnun',
      description:
        'Notaður sem texti fyrir týpu vistun á viðeigandi stofnun á kröfu í kröfu PDF',
    },
    investigate: {
      id: 'judicial.system.backend:pdf.core.case_type.investigate',
      defaultMessage: 'rannsóknarheimild',
      description:
        'Notaður sem texti fyrir týpu rannsóknarheimild á kröfu í kröfu PDF',
    },
  }),
}
