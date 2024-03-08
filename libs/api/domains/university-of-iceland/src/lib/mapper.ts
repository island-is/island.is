import {
  StudentTrackDto,
  StudentTrackOverviewDto,
} from '@island.is/clients/university-careers'
import { Student, StudentTrackModel } from './models/studentInfo.model'
import { isDefined } from '@island.is/shared/utils'

export const mapToStudent = (data: StudentTrackDto): Student | null => {
  if (
    !data ||
    !data?.name ||
    !data?.graduationDate ||
    !data?.trackNumber ||
    !data?.school ||
    !data?.faculty ||
    !data?.studyProgram ||
    !data?.degree ||
    !data?.institution?.displayName ||
    !data?.institution?.id
  ) {
    return null
  }

  return {
    name: data.name,
    trackNumber: data.trackNumber,
    institution: {
      id: data.institution.id,
      displayName: data.institution.displayName,
    },
    school: data.school,
    faculty: data.faculty,
    studyProgram: data.studyProgram,
    degree: data.degree,
    graduationDate: data.graduationDate.toISOString(),
  }
}

export const mapToStudentTrackModel = (
  data: StudentTrackOverviewDto,
): StudentTrackModel | null => {
  if (
    !data.transcript ||
    !data?.body?.description ||
    !data?.body?.footer ||
    !data?.body?.unconfirmedData
  ) {
    return null
  }

  const transcript = mapToStudent(data.transcript)

  if (!transcript) {
    return null
  }

  return {
    transcript,
    files:
      data.files
        ?.map((d) => {
          if (!d.type || !d.locale || !d.displayName || !d.fileName) {
            return null
          }

          return {
            type: d.type,
            locale: d.locale,
            displayName: d.displayName,
            fileName: d.fileName,
          }
        })
        .filter(isDefined) ?? [],
    body: {
      description: data?.body?.description,
      footer: data?.body?.footer,
      unconfirmedData: data?.body?.unconfirmedData,
    },
  }
}
