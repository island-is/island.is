import { defineMessage } from '@formatjs/intl'
import { CaseType } from '@island.is/judicial-system/types'

export const custodyNotice = {
  isolationDisclaimer: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.isolation_disclaimer',
    defaultMessage:
      '{genderedAccused} skal sæta einangrun til {isolationPeriod}.',
    description: 'Notaður sem texti til að segja til um einangrun',
  }),
  rulingTitle: {
    id: 'judicial.system.backend:pdf.custody_notice.ruling_title',
    defaultMessage: `Úrskuður um {caseType, select,
      ${CaseType.ADMISSION_TO_FACILITY} {vistun á viðeigandi stofnun} 
      other {gæsluvarðhald}}`,
    description:
      'Titill á vistunarselði sem tilgreinir í hverning máli úrskurðurinn er',
  },
  arrangement: {
    id: 'judicial.system.backend:pdf.custody_notice.arrangement',
    defaultMessage: `Tilhögun {caseType, select,
      ${CaseType.ADMISSION_TO_FACILITY} {vistunar á viðeigandi stofnun}
      other {gæsluvarðhalds}}`,
  },
}
