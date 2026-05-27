import { CrimeSceneMap, IndictmentSubtype } from './case'
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
  return policeCaseNumberSubTypes?.length === 1
    ? policeCaseNumberSubTypes.includes(IndictmentSubtype.TRAFFIC_VIOLATION)
    : Boolean(
        indictmentCountSubtypes?.includes(IndictmentSubtype.TRAFFIC_VIOLATION),
      )
}

interface IndictmentCount {
  created?: string | Date | null
  policeCaseNumber?: string | null
}

export const getIndictmentCountCompare =
  (crimeScenes: CrimeSceneMap | undefined | null) =>
  (a: IndictmentCount, b: IndictmentCount): number => {
    const getDateMs = (
      date: Date | string | undefined | null,
    ): number | undefined => {
      if (!date) return undefined
      if (typeof date === 'string') return new Date(date).getTime()
      return date.getTime()
    }

    const aDate = getDateMs(
      a.policeCaseNumber ? crimeScenes?.[a.policeCaseNumber]?.date : undefined,
    )
    const bDate = getDateMs(
      b.policeCaseNumber ? crimeScenes?.[b.policeCaseNumber]?.date : undefined,
    )

    if (aDate === undefined || aDate === null) {
      return bDate === undefined || bDate === null ? 0 : 1
    }

    if (bDate === undefined || bDate === null) {
      return -1
    }

    return aDate !== bDate ? (aDate < bDate ? -1 : 1) : 0
  }
