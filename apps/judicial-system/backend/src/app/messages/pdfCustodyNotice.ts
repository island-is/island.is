import { defineMessage } from '@formatjs/intl'

export const custodyNotice = {
  isolationDisclaimer: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.isolation_disclaimer',
    defaultMessage:
      '{genderedAccused} skal sæta einangrun til {isolationPeriod}.',
    description: 'Notaður sem texti til að segja til um einangrun',
  }),
}
