import { FieldBaseProps, FormatMessage } from '@island.is/application/types'

export type TechInfoItem = {
  variableName?: string
  label?: string
  type?: string
  required?: boolean
  maxLength?: string
  values?: string[]
}

export type FormFieldMapperType = {
  item: TechInfoItem
  props: FieldBaseProps
  displayError: boolean
  watchTechInfoFields: any
  formatMessage: FormatMessage
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
