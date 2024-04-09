import {
  BifrostStudentTrack,
  HolarStudentTrack,
  LbhiStudentTrack,
  UnakStudentTrack,
  HIStudentTrack,
} from '../clients'
import {
  StudentTrackInstitutionDto,
  mapToStudentTrackInstitutionDto,
} from './studentTrackInstitutionDto'

export interface StudentTrackDto {
  name?: string
  nationalId?: string
  graduationDate?: Date
  trackNumber?: number
  institution?: StudentTrackInstitutionDto
  school?: string
  faculty?: string
  studyProgram?: string
  degree?: string
}

export const mapToStudentTrackDto = (
  transcript:
    | HolarStudentTrack
    | LbhiStudentTrack
    | BifrostStudentTrack
    | UnakStudentTrack
    | HIStudentTrack,
): StudentTrackDto | null => {
  if (!transcript.graduationDate) {
    return null
  }

  return {
    ...transcript,
    institution: mapToStudentTrackInstitutionDto(transcript.institution),
    graduationDate: new Date(transcript.graduationDate),
  }
}
