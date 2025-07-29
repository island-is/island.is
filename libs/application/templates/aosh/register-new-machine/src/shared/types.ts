import { FieldBaseProps, FormatMessage } from '@island.is/application/types'

export type TechInfoItem = {
  name?: string
  label?: string
  labelEn?: string
  type?: string
  required?: boolean
  maxLength?: string
  values?: TechInfoListItem[]
}

export type TechInfoListItem = {
  name: string
  nameEn: string
}

export type FormFieldMapperType = {
  item: TechInfoItem
  props: FieldBaseProps
  displayError: boolean
  watchTechInfoFields: any
  formatMessage: FormatMessage
  lang: 'is' | 'en'
}

export type CategoryType = {
  nameIs: string
  nameEn: string
}

export type CategoryFromServiceType = {
  categoryIs: string
  categoryEn: string
  subcategoryIs: string
  subcategoryEn: string
  registrationNumberPrefix: string
}

export type AboutMachineType = {
  machineParentCategories: {
    name: string
    nameEn: string
  }[]
  machineType: string
  machineModel: string
  machineCategory: CategoryType
  machineSubCategory: CategoryType
  fromService: boolean
  categoriesFromService: CategoryFromServiceType[]
}

export enum Status {
  TEMPORARY = 'Temporary',
  PERMANENT = 'Permanent',
}

export enum Plate {
  A = '1',
  B = '2',
  D = '3',
}

export const NEW = 'new'
export const USED = 'used'
