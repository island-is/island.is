import { defineMessage } from '@formatjs/intl'

export const custodyNotice = {
  isolationDisclaimer: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.isolation_disclaimer',
    defaultMessage:
      '{genderedAccused} skal sæta einangrun til {isolationPeriod}.',
    description: 'Notaður sem texti til að segja til um einangrun',
  }),
  rulingTitle: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.ruling_title',
    defaultMessage:
      'Úrskuður um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}',
    description:
      'Titill á vistunarselði sem tilgreinir í hverning máli úrskurðurinn er',
  }),
  arrangement: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.arrangement',
    defaultMessage:
      'Tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunar á viðeigandi stofnun} other {gæsluvarðhalds}}',
  }),
}
