import { MachineFriendlyDto } from '../..'
import { EntityDto } from './entity.dto'
import { LabelDto } from './label.dto'
import { LinkDto } from './link.dto'
import { TypeDto, mapType } from './type.dto'

export interface WorkMachinesCollectionItem {
  id: string
  registrationNumber?: string
  type?: TypeDto
  status?: string
  category?: string
  subCategory?: string
  productionYear?: string
  registrationDate?: string
  owner?: EntityDto
  supervisor?: EntityDto
  productionNumber?: string
  productionCountry?: string
  licensePlateNumber?: string
  importer?: string
  insurer?: string
  dateLastInspection?: string
  paymentRequiredForOwnerChange?: boolean
  links?: Array<LinkDto>
  labels?: Array<LabelDto>
}

export const mapWorkMachinesCollectionItem = (
  item: MachineFriendlyDto,
): WorkMachinesCollectionItem | null => {
  const { id, ...rest } = item
  if (!id) {
    return null
  }

  return {
    id,
    registrationNumber: rest.registrationNumber ?? undefined,
    type: mapType(rest?.type ?? undefined) ?? undefined,
    status: rest.status ?? undefined,
    category: rest.category ?? undefined,
    subCategory: rest.subCategory ?? undefined,
    dateLastInspection: rest.dateLastInspection ?? undefined,
    licensePlateNumber: rest.licensePlateNumber ?? undefined,
    paymentRequiredForOwnerChange:
      rest.paymentRequiredForOwnerChange ?? undefined,
    owner: rest.owner
      ? {
          number: rest.ownerNumber ?? undefined,
          name: rest.owner ?? undefined,
        }
      : undefined,
    supervisor: rest.supervisor
      ? {
          name: rest.supervisor ?? undefined,
        }
      : undefined,
  }
}
