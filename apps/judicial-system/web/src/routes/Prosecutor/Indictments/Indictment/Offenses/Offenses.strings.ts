import { defineMessages } from 'react-intl'

import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'

export const strings = {
  ...defineMessages({
    incidentTitle: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_title',
      defaultMessage: 'Brot',
      description:
        'Notaður sem titill á "brot" lista á ákæruliða skrefi í ákærum.',
    },
    incidentLabel: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_label',
      defaultMessage: 'Brot',
      description:
        'Notaður sem titill á "brot" lista á ákæruliða skrefi í ákærum.',
    },
    incidentPlaceholder: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_placeholder',
      defaultMessage: 'Veldu brot',
      description:
        'Notaður sem skýritexti á "brot" lista á ákæruliða skrefi í ákærum.',
    },
    bloodAlcoholContentTitle: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.blood_alcohol_content_title',
      defaultMessage: 'Vínandamagn',
      description:
        'Notaður sem titill á "vínandamagn" svæði á ákæruliða skrefi í ákærum.',
    },
    bloodAlcoholContentLabel: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.blood_alcohol_content_label',
      defaultMessage: 'Vínandamagn (‰)',
      description:
        'Notaður sem titill á "vínandamagn" svæði á ákæruliða skrefi í ákærum.',
    },
    bloodAlcoholContentPlaceholder: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.blood_alcohol_content_placeholder',
      defaultMessage: '0,00',
      description:
        'Notaður sem skýritexti á "vínandamagn" svæði á ákæruliða skrefi í ákærum.',
    },
  }),
  offenseText: {
    [IndictmentCountOffense.DRIVING_WITHOUT_LICENCE]: 'Sviptingarakstur',
    [IndictmentCountOffense.DRIVING_WITHOUT_VALID_LICENSE]:
      'Akstur án gildra ökuréttinda',
    [IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE]:
      'Akstur án þess að hafa öðlast ökuréttindi',
    [IndictmentCountOffense.DRUNK_DRIVING]: 'Ölvunarakstur',
    [IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING]: 'Fíkniefnaakstur',
    [IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING]: 'Lyfjaakstur',
    [IndictmentCountOffense.SPEEDING]: 'Hraðakstur',
    [IndictmentCountOffense.OTHER]: 'Annað',
  },
}
