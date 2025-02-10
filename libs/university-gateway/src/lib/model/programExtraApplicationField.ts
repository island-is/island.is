import { FieldType } from '../types/fieldType'

export interface IProgramExtraApplicationField {
  externalKey: string
  nameIs: string
  nameEn: string
  descriptionIs?: string
  descriptionEn?: string
  required: boolean
  fieldType: FieldType
  uploadAcceptedFileType?: string
  options?: string
}
