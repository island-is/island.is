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
  }),
}
