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

interface IndictmentCount {
  created?: string | Date | null
  policeCaseNumber?: string | null
}

export const getIndictmentCountCompare =
  (policeCaseNumbers: string[] | undefined | null) =>
  (a: IndictmentCount, b: IndictmentCount): number => {
    if (!policeCaseNumbers) {
      // This should never happen
      return 0
    }

    const aCreated =
      typeof a.created === 'string'
        ? new Date(a.created).getTime()
        : a.created?.getTime() ?? 0
    const aPoliceCaseNumber = a.policeCaseNumber ?? ''
    const aIndex = policeCaseNumbers.findIndex((n) => n === aPoliceCaseNumber)
    const bCreated =
      typeof b.created === 'string'
        ? new Date(b.created).getTime()
        : b.created?.getTime() ?? 0
    const bPoliceCaseNumber = b.policeCaseNumber ?? ''
    const bIndex = policeCaseNumbers.findIndex((n) => n === bPoliceCaseNumber)

    let result: number

    // We want incictment counts with missing police case numbers
    // to be at the end of the list
    if (aIndex < 0) {
      result = bIndex < 0 ? 0 : 1
    } else if (bIndex < 0) {
      result = -1
    } else {
      result = aIndex !== bIndex ? (aIndex < bIndex ? -1 : 1) : 0
    }

    return result === 0
      ? // When the police case numbers are equal we order by creation date
        aCreated !== bCreated
        ? aCreated < bCreated
          ? -1
          : 1
        : 0
      : result
  }
