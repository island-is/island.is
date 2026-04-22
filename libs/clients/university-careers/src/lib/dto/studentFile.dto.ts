import type { StudentFile } from '../../../gen/fetch'
import { StudentFileType } from '../universityCareers.types'

export interface StudentFileDto {
  type: StudentFileType
  url?: string
  displayName?: string
  fileName?: string
}

const FILE_TYPE_MAP: Record<string, StudentFileType> = {
  transcript: 'transcript',
  diploma: 'diploma',
  diploma_supplement: 'diploma_supplement',
  course_descriptions: 'course_descriptions',
  micro_credentials_supplement: 'micro_credentials_supplement',
  micro_credentials_transcript: 'micro_credentials_transcript',
}

export const mapToStudentFileDto = (
  file: StudentFile,
): StudentFileDto | null => {
  const type = file.type ? FILE_TYPE_MAP[file.type] ?? null : null
  if (!type) {
    return null
  }

  return {
    type,
    url: file.url,
    displayName: file.displayName,
    fileName: file.fileName,
  }
}
