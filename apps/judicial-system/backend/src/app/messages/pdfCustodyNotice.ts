import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

export const custodyNotice = {
  isolationDisclaimer: 'Varnaraðili skal sæta einangrun til {isolationPeriod}.',
  rulingTitle:
    'Úrskurður um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}',
  arrangement:
    'Tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}}',
  rulingRestrictions: {
    [CaseCustodyRestrictions.NECESSITIES]:
      'banni við útvegun persónulegra nauðsynja (A)',
    [CaseCustodyRestrictions.VISITAION]: 'heimsóknarbanni (C)',
    [CaseCustodyRestrictions.COMMUNICATION]: 'bréfaskoðun og símabanni (D)',
    [CaseCustodyRestrictions.MEDIA]: 'fjölmiðlabanni (E)',
    [CaseCustodyRestrictions.WORKBAN]: 'vinnubanni (F)',
  },
  withFurtherRestrictions:
    'Sækjandi tekur fram að {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldið}} verði með {restrictions} skv. 99. gr. laga nr. 88/2008.',
  noFutherRestrictions:
    'Sækjandi tekur fram að {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldið}} verði án {hasIsolation, select, true {annarra } other {}}takmarkana.',
}
