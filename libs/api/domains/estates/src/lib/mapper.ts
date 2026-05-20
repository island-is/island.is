import type { Estate } from '@island.is/clients/estates'
import { isDefined } from '@island.is/shared/utils'
import { EstatesEstate } from './models/estate.model'

export const mapToEstate = (e: Estate): EstatesEstate | undefined => {
  if (!e.caseId || !e.deceased?.name || !e.deceased?.sid) {
    return undefined
  }

  return {
    caseNumber: e.caseId,
    nameOfDeceased: e.deceased.name,
    nationalIdOfDeceased: e.deceased.sid,
    dateOfDeath: e.dateOfDeath ?? undefined,
  }
}

export const mapToEstateCollection = (estates: Estate[]): EstatesEstate[] => {
  return estates.map(mapToEstate).filter(isDefined)
}
