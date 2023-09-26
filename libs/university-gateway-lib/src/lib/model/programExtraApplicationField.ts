import { FieldType } from '../types'

export interface IProgramExtraApplicationField {
  nameIs: string
  nameEn: string
  descriptionIs?: string
  descriptionEn?: string
  required: boolean
  fieldKey: string
  fieldType: FieldType
  uploadAcceptedFileType?: string
}
