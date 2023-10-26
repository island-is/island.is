import { FieldType } from '../types'

export interface IProgramExtraApplicationField {
  externalId: string
  nameIs: string
  nameEn: string
  descriptionIs?: string
  descriptionEn?: string
  required: boolean
  fieldType: FieldType
  uploadAcceptedFileType?: string
}
