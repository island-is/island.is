import {
  LbhiStudentFile,
  BifrostStudentFile,
  UnakStudentFile,
  HIStudentFile,
  HolarStudentFile,
  LHIStudentFile,
} from '../clients'
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

const typeFromUrl = (url?: string): StudentFileType | null => {
  const segment = url?.split('/').pop()
  return segment ? (FILE_TYPE_MAP[segment] ?? null) : null
}

export const mapToStudentFileDto = (
  transcript:
    | HolarStudentFile
    | LbhiStudentFile
    | BifrostStudentFile
    | UnakStudentFile
    | HIStudentFile
    | LHIStudentFile,
): StudentFileDto | null => {
  const type = typeFromUrl(transcript.url)
  if (!type) {
    return null
  }

  return {
    type,
    url: transcript.url,
    displayName: transcript.displayName,
    fileName: transcript.fileName,
  }
}
