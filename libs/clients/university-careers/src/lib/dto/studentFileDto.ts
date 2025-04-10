import {
  LbhiStudentFile,
  BifrostStudentFile,
  UnakStudentFile,
  HIStudentFile,
  HolarStudentFile,
} from '../clients'
import { StudentFileType, mapStudentFileType } from './studentFileType.dto'

export interface StudentFileDto {
  type: StudentFileType
  locale?: string
  displayName?: string
  fileName?: string
}

export const mapToStudentFileDto = (
  transcript:
    | HolarStudentFile
    | LbhiStudentFile
    | BifrostStudentFile
    | UnakStudentFile
    | HIStudentFile,
): StudentFileDto | null => {
  if (!transcript.type) {
    return null
  }

  return {
    type: mapStudentFileType(transcript.type),
    ...transcript,
  }
}
