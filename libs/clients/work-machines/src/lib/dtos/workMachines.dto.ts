import { Entity, EntityDto } from './entity.dto'
import { LabelDto } from './label.dto'
import { LinkDto } from './link.dto'
import { TypeDto } from './type.dto'

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
  paymentRequiredForOwnerChange?: string
  links?: Array<LinkDto>
  labels?: Array<LabelDto>
}
