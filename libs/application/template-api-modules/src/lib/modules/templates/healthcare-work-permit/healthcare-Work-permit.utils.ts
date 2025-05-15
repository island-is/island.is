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
  if (!innaDiplomas || !innaDiplomas?.items)
    return [
      {
        studyProgram: 'Sjúkraliði',
        programId: 'SJbrú',
        graduationDate: new Date('2024.01.01'),
        schoolName: 'VMA',
      },
      {
        studyProgram: 'Rafvirki',
        programId: 'RAF',
        graduationDate: new Date(),
        schoolName: 'VMA',
      },
    ]

  return innaDiplomas.items.map(
    ({ diplomaDate, diplomaCode, diplomaName, organisation }) => ({
      studyProgram: diplomaName,
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
