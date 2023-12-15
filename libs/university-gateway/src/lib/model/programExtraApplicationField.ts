import { FieldType } from '../types/fieldType'

export interface IProgramExtraApplicationField {
  externalId: string
  nameIs: string
  nameEn: string
  descriptionIs?: string
  descriptionEn?: string
  required: boolean
  fieldType: FieldType
  uploadAcceptedFileType?: string
  options?: string
}
