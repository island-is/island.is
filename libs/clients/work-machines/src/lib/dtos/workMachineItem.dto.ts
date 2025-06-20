import { MachineFriendlyDto, MachineHateoasDto } from '../..'
import { EntityDto } from './entity.dto'
import { LabelDto } from './label.dto'
import { LinkDto } from './link.dto'
import { mapType } from './type.dto'

export interface WorkMachinesCollectionItem {
  id: string
  registrationNumber?: string
  type?: string
  model?: string
  status?: string
  category?: string
  subCategory?: string
  /** Only populated for single item, not collection */
  productionYear?: string
  registrationDate?: string
  owner?: EntityDto
  supervisor?: EntityDto
  /** Only populated for single item, not collection */
  productionCountry?: string
  /** Only populated for single item, not collection */
  productionNumber?: string
  licensePlateNumber?: string
  importer?: string
  insurer?: string
  dateLastInspection?: string
  paymentRequiredForOwnerChange?: boolean
  /** Only populated for single item, not collection */
  links?: Array<LinkDto>
  /** Only populated for single item, not collection */
  labels?: Array<LabelDto>
}

export const mapWorkMachinesCollectionItem = (
  item: MachineFriendlyDto,
): WorkMachinesCollectionItem | null => {
  const { id, ...rest } = item
  if (!id) {
    return null
  }

  const { type, model } = mapType(rest?.type ?? undefined)

  return {
    id,
    registrationNumber: rest.registrationNumber ?? undefined,
    type,
    model,
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

export const mapWorkMachine = (
  item: MachineHateoasDto,
): WorkMachinesCollectionItem | null => {
  const { id, ...rest } = item
  if (!id) {
    return null
  }

  const { type, model } = mapType(rest?.type ?? undefined)

  return {
    id,
    registrationNumber: rest.registrationNumber ?? undefined,
    registrationDate: rest.registrationDate ?? undefined,
    type,
    model,
    status: rest.status ?? undefined,
    category: rest.category ?? undefined,
    subCategory: rest.subCategory ?? undefined,
    owner: rest.ownerName
      ? {
          number: rest.ownerNumber ?? undefined,
          name: rest.ownerName,
          address: rest.ownerAddress ?? undefined,
          nationalId: rest.ownerNationalId ?? undefined,
          postcode: rest.ownerPostcode ?? undefined,
        }
      : undefined,
    supervisor: rest.supervisorName
      ? {
          name: rest.supervisorName,
          address: rest.supervisorAddress ?? undefined,
          nationalId: rest.supervisorNationalId ?? undefined,
          postcode: rest.supervisorPostcode ?? undefined,
        }
      : undefined,
    productionNumber: rest.productionNumber ?? undefined,
    productionCountry: rest.productionCountry ?? undefined,
    productionYear: rest.productionYear?.toString() ?? undefined,
    licensePlateNumber: rest.licensePlateNumber ?? undefined,
    importer: rest.importer ?? undefined,
    insurer: rest.insurer ?? undefined,
    dateLastInspection: rest.dateLastInspection ?? undefined,
    paymentRequiredForOwnerChange:
      rest.paymentRequiredForOwnerChange ?? undefined,
  }
}
