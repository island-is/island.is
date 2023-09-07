import { FieldType } from '@island.is/university-gateway-types'

export type ProgramExtraApplicationField = {
  nameIs: string
  nameEn?: string
  descriptionIs?: string
  descriptionEn?: string
  required: boolean
  fieldType: FieldType
  uploadAcceptedFileType?: string
}

// import { FieldType } from '../types'

// export type ProgramExtraApplicationField = {
//   id: string
//   programId: string
//   nameIs: string
//   nameEn: string
//   descriptionIs: string
//   descriptionEn: string
//   required: boolean
//   fieldType: FieldType
//   uploadAcceptedFileType: string
//   created: Date
//   modified: Date
// }
