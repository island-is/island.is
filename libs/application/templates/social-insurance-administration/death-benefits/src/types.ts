import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'

export interface ChildInformation {
  nationalId: string
  fullName: string
}

export interface FileUpload {
  expectingChild?: FileType[]
  deathCertificate?: FileType[]
}
