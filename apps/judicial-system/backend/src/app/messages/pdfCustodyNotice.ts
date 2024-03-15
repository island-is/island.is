import { defineMessage, defineMessages } from '@formatjs/intl'

import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

export const custodyNotice = {
  isolationDisclaimer: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.isolation_disclaimerV1',
    defaultMessage: 'Varnaraðili skal sæta einangrun til {isolationPeriod}.',
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
  rulingRestrictions: defineMessages({
    [CaseCustodyRestrictions.NECESSITIES]: {
      id: 'judicial.system.backend:pdf.custody_notice.ruling_restrictions.necessities',
      defaultMessage: 'banni við útvegun persónulegra nauðsynja',
      description: '',
    },
    [CaseCustodyRestrictions.VISITAION]: {
      id: 'judicial.system.backend:pdf.custody_notice.ruling_restrictions.visitation',
      defaultMessage: 'heimsóknarbanni',
      description: '',
    },
    [CaseCustodyRestrictions.COMMUNICATION]: {
      id: 'judicial.system.backend:pdf.custody_notice.ruling_restrictions.communication',
      defaultMessage: 'bréfaskoðun og símabanni',
      description: '',
    },
    [CaseCustodyRestrictions.MEDIA]: {
      id: 'judicial.system.backend:pdf.custody_notice.ruling_restrictions.media',
      defaultMessage: 'fjölmiðlabanni',
      description: '',
    },
    [CaseCustodyRestrictions.WORKBAN]: {
      id: 'judicial.system.backend:pdf.custody_notice.ruling_restrictions.workban',
      defaultMessage: 'vinnubanni',
      description: '',
    },
  }),
  withFurtherRestrictions: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.with_further_restrictions',
    defaultMessage:
      'Sækjandi tekur fram að {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldið}} verði með {restrictions} skv. 99. gr. laga nr. 88/2008.',
    description: '',
  }),
  noFutherRestrictions: defineMessage({
    id: 'judicial.system.backend:pdf.custody_notice.ruling_restrictions.no_further_restrictions',
    defaultMessage:
      'Sækjandi tekur fram að {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldið}} verði án {hasIsolation, select, true {annara } other {}}takmarkana.',
    description: '',
  }),
}
