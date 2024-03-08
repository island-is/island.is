import {
  BifrostStudentTrack,
  HolarStudentTrack,
  LbhiStudentTrack,
  UnakStudentTrack,
} from '../clients'

export interface StudentTrackDto {
  name?: string
  nationalId?: string
  graduationDate?: Date
  trackNumber?: number
  institution?: {
    id?: string
    displayName?: string
  }
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
    | UnakStudentTrack,
): StudentTrackDto | null => {
  if (!transcript.graduationDate) {
    return null
  }

  return {
    ...transcript,
    graduationDate: new Date(transcript.graduationDate),
  }
}
