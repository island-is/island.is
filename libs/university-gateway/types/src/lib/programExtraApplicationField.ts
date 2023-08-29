import { FieldType } from './fieldType'

export type ProgramExtraApplicationField = {
  id: string
  programId: string
  nameIs: string
  nameEn: string
  descriptionIs: string
  descriptionEn: string
  required: boolean
  fieldType: FieldType
  uploadAcceptedFileType: string
  created: Date
  modified: Date
}
