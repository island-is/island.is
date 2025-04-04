import {
  MachineHateoasDto,
  MachinesFriendlyHateaosDto,
} from '@island.is/clients/work-machines'
import { WorkMachine } from './models/v2/workMachine.model'
import { Type } from './models/v2/type.model'
import isValid from 'date-fns/isValid'
import format from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import { Action, ExternalLink } from './workMachines.types'

const mapRelationToAction = (relation?: string) => {
  switch (relation) {
    case 'requestInspection':
      return Action.REQUEST_INSPECTION
    case 'changeStatus':
      return Action.CHANGE_STATUS
    case 'ownerChange':
      return Action.OWNER_CHANGE
    case 'supervisorChange':
      return Action.SUPERVISOR_CHANGE
    case 'registerForTraffic':
      return Action.REGISTER_FOR_TRAFFIC
    default:
      return null
  }
}

const mapRelationToCollectionLink = (relation?: string) => {
  switch (relation) {
    case 'self':
      return ExternalLink.SELF
    case 'nextPage':
      return ExternalLink.NEXT_PAGE
    case 'excel':
      return ExternalLink.EXCEL
    case 'csv':
      return ExternalLink.CSV
    default:
      return null
  }
}

export const mapType = (type?: string): Type | null => {
  if (!type) {
    return null
  }
  const [mainType, ...subtype] = type.split(' ')
  return {
    type: mainType,
    subtype: subtype.join(),
    fullType: type,
  }
}

export const mapWorkMachineCollection = (
  data: MachinesFriendlyHateaosDto,
): PaginatedCollectionResponse | null => {}

export const mapWorkMachineModel = (
  dto: MachineHateoasDto,
): WorkMachine | null => {
  if (!dto.id || !dto.registrationNumber) {
    return null
  }
  const inspectionDate = dto.dateLastInspection
    ? new Date(dto.dateLastInspection)
    : undefined

  return {
    id: dto.id,
    registrationNumber: dto.registrationNumber,
    type: mapType(dto.type ?? undefined) ?? undefined,
    owner: dto.ownerName
      ? {
          name: dto.ownerName ?? undefined,
          number: dto.ownerNumber ?? undefined,
          address: dto.ownerAddress ?? undefined,
          nationalId: dto.ownerNationalId ?? undefined,
          postcode: dto.ownerPostcode ?? undefined,
        }
      : undefined,
    supervisor: dto.supervisorName
      ? {
          name: dto.supervisorName ?? undefined,
          nationalId: dto.supervisorNationalId ?? undefined,
          postcode: dto.supervisorPostcode ?? undefined,
          address: dto.supervisorAddress ?? undefined,
        }
      : undefined,
    status: dto.status ?? undefined,
    category: dto.category ?? undefined,
    subcategory: dto.subCategory ?? undefined,
    licensePlateNumber: dto.licensePlateNumber ?? undefined,
    paymentRequiredForOwnerChange:
      dto.paymentRequiredForOwnerChange ?? undefined,
    dateLastInspection:
      inspectionDate && isValid(inspectionDate)
        ? format(inspectionDate, 'dd-MM-yyyy')
        : undefined,
    links: dto?.links
      ?.map((l) => {
        if (!l.href || !l.method || l.rel) {
          return null
        }
        const rel = mapRelationToAction(l.rel ?? '')
        if (!rel) {
          return null
        }
        return {
          href: l.href,
          method: l.method,
          rel,
          displayTitle: l.displayTitle ?? undefined,
        }
      })
      .filter(isDefined),
    labels: dto?.labels?.map((l) => ({
      columnName: l.columnName ?? undefined,
      displayTitle: l.displayTitle ?? undefined,
      tooltip: l.tooltip ?? undefined,
    })),
  }
}
