import { FileType } from './fileType.enum'

export class DocumentTypeFilter {
  senderName!: string
  senderNatReg!: string
  subjectContains!: string
  url!: string
  fileType!: FileType
}
