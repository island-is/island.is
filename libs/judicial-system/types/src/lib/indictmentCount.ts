import { IndictmentSubtype } from './case'
import {
  ILLEGAL_DRUGS_AND_PRESCRIPTION_DRUGS_DRIVING,
  Substance,
} from './substances'

export enum IndictmentCountOffense {
  DRIVING_WITHOUT_LICENCE = 'DRIVING_WITHOUT_LICENCE',
  DRIVING_WITHOUT_VALID_LICENSE = 'DRIVING_WITHOUT_VALID_LICENSE',
  DRIVING_WITHOUT_EVER_HAVING_LICENSE = 'DRIVING_WITHOUT_EVER_HAVING_LICENSE',
  DRUNK_DRIVING = 'DRUNK_DRIVING',
  ILLEGAL_DRUGS_DRIVING = 'ILLEGAL_DRUGS_DRIVING',
  PRESCRIPTION_DRUGS_DRIVING = 'PRESCRIPTION_DRUGS_DRIVING',
  SPEEDING = 'SPEEDING',
  OTHER = 'OTHER',
}

export type SubstanceMap = { [key in Substance]?: string }

export const offenseSubstances: {
  [key in IndictmentCountOffense]: Substance[]
} = {
  [IndictmentCountOffense.DRIVING_WITHOUT_LICENCE]: [],
  [IndictmentCountOffense.DRIVING_WITHOUT_VALID_LICENSE]: [],
  [IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE]: [],
  [IndictmentCountOffense.DRUNK_DRIVING]: [Substance.ALCOHOL],
  [IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING]:
    ILLEGAL_DRUGS_AND_PRESCRIPTION_DRUGS_DRIVING,
  [IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING]:
    ILLEGAL_DRUGS_AND_PRESCRIPTION_DRUGS_DRIVING,
  [IndictmentCountOffense.SPEEDING]: [],
  [IndictmentCountOffense.OTHER]: [],
}

export const isTrafficViolationIndictmentCount = (
  indictmentCountSubtypes: IndictmentSubtype[] | undefined | null,
  policeCaseNumberSubTypes: IndictmentSubtype[] | undefined | null,
): boolean => {
  return (
    indictmentCountSubtypes?.includes(IndictmentSubtype.TRAFFIC_VIOLATION) ||
    (policeCaseNumberSubTypes?.length === 1 &&
      policeCaseNumberSubTypes.includes(IndictmentSubtype.TRAFFIC_VIOLATION))
  )
}
