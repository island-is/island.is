import type { Estate } from '@island.is/clients/estates'
import { isDefined } from '@island.is/shared/utils'
import { Estate as EstateModel } from './models/estate.model'

export const mapToEstate = (e: Estate): EstateModel | undefined => {
  if (!e.caseId || !e.deceased?.name || !e.deceased?.sid) {
    return undefined
  }

  return {
    id: e.caseId,
    nameOfDeceased: e.deceased.name,
    nationalIdOfDeceased: e.deceased.sid,
    dateOfDeath: e.dateOfDeath ?? undefined,
    isFinished: e.status?.isOpen !== undefined ? !e.status.isOpen : undefined,
    representative:
      e.representative?.name && e.representative?.sid
        ? { name: e.representative.name, nationalId: e.representative.sid }
        : undefined,
  }
}

export const mapToEstateCollection = (estates: Estate[]): EstateModel[] => {
  return estates.map(mapToEstate).filter(isDefined)
}
