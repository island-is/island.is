import { Pagination } from '@island.is/clients/assets'
import { DefaultAddress } from './Assets.type'

export interface Appraisal {
  activeAppraisal?: number
  plannedAppraisal?: number | null
  activeStructureAppraisal?: number
  plannedStructureAppraisal?: number | null
  activePlotAssessment?: number
  plannedPlotAssessment?: number | null
  activeYear?: number
  plannedYear?: number
}
export interface RegisteredOwner {
  name?: string | null
  ssn?: string | null
  ownership?: number
  purchaseDate?: Date
  grantDisplay?: string | null
}

export interface RegisteredOwnerWrapper {
  registeredOwners?: Array<RegisteredOwner> | null
  paging?: Pagination | null
}

export interface UnitOfUse {
  unitOfUseNumber?: string | null
  propertyNumber?: string | null
  address?: DefaultAddress
  marking?: string | null
  usageDisplay?: string | null
  explanation?: string | null
  buildYearDisplay?: string | null
  displaySize?: number
  appraisal?: Appraisal
  fireAssessment?: number
}

export interface LandWrapper {
  landNumber?: string | null
  landAppraisal?: number | null
  useDisplay?: string | null
  area?: string | null
  areaUnit?: string | null
  registeredOwners?: RegisteredOwnerWrapper | null
}

export interface UnitsOfUseWrapper {
  unitsOfUse?: Array<UnitOfUse> | null
  paging?: Pagination | null
}

export interface PropertySingleDTO {
  propertyNumber?: string | null
  defaultAddress?: DefaultAddress | null
  appraisal?: Appraisal | null
  registeredOwners?: RegisteredOwnerWrapper | null
  unitsOfUse?: UnitsOfUseWrapper | null
  land?: LandWrapper | null
}
