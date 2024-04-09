import {
  StudentTrackDto,
  StudentTrackOverviewDto,
} from '@island.is/clients/university-careers'
import { isDefined } from '@island.is/shared/utils'
import { StudentTrack } from './models/studentTrack.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'
import { Institution } from './models/institution.model'

export const mapToStudent = (
  data: StudentTrackDto,
  institutionFallback: Institution,
): StudentTrackTranscript | null => {
  if (
    !data ||
    !data?.name ||
    !data?.graduationDate ||
    !data?.trackNumber ||
    !data?.school ||
    !data?.faculty ||
    !data?.studyProgram ||
    !data?.degree
  ) {
    return null
  }

  let institution: Institution | undefined = undefined

  if (data.institution?.id && data.institution?.displayName) {
    institution = {
      id: data.institution.id,
      displayName: data.institution.displayName,
    }
  } else {
    institution = institutionFallback
  }

  return {
    name: data.name,
    trackNumber: data.trackNumber,
    institution,
    school: data.school,
    faculty: data.faculty,
    studyProgram: data.studyProgram,
    degree: data.degree,
    graduationDate: data.graduationDate.toISOString(),
  }
}

export const mapToStudentTrackModel = (
  data: StudentTrackOverviewDto,
  institution: Institution,
): StudentTrack | null => {
  if (
    !data.transcript ||
    !data?.body?.description ||
    !data?.body?.footer ||
    !data?.body?.unconfirmedData
  ) {
    return null
  }

  const transcript = mapToStudent(data.transcript, institution)

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
    metadata: {
      description: data?.body?.description,
      footer: data?.body?.footer,
      unconfirmedData: data?.body?.unconfirmedData,
    },
  }
}
