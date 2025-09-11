import { InlineResponse200 } from '@island.is/clients/inna'
import { StudentTrackDto } from '@island.is/clients/university-careers'

export type StudentGraduations = {
  studyProgram?: string
  programId?: string
  graduationDate?: Date
  schoolName?: string
}

export const mapSecondarySchoolStudentTrack = (
  innaDiplomas: InlineResponse200 | null,
): StudentGraduations[] => {
  if (!innaDiplomas || !innaDiplomas?.items) return []

  return innaDiplomas.items.map(
    ({ diplomaDate, diplomaCode, diplomaLongName, organisation }) => ({
      studyProgram: diplomaLongName,
      programId: diplomaCode,
      graduationDate: diplomaDate ? new Date(diplomaDate) : undefined,
      schoolName: organisation,
    }),
  )
}

export const mapUniversityStudentTracks = (
  studentTracks: StudentTrackDto[] | null,
): StudentGraduations[] => {
  if (!studentTracks) return []
  return studentTracks.map((studentTrack) => ({
    studyProgram: studentTrack.studyProgram,
    programId: studentTrack.programId,
    graduationDate: studentTrack.graduationDate,
    schoolName: studentTrack.institution?.displayName,
  }))
}
