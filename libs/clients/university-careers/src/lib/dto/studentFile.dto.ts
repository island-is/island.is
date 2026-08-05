import type { StudentFile } from '../../../gen/fetch'

export interface StudentFileDto {
  url?: string
  displayName?: string
  fileName?: string
}

export const mapToStudentFileDto = (file: StudentFile): StudentFileDto => {
  return {
    url: file.url,
    displayName: file.displayName,
    fileName: file.fileName,
  }
}
