import {
  StudentFileType,
  StudentTrackDto,
  StudentTrackOverviewDto,
} from '@island.is/clients/university-careers'
import { isDefined } from '@island.is/shared/utils'
import { StudentTrack } from './models/studentTrack.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'
import { Institution } from './models/institution.model'
import { FileType, InstitutionProps } from './universityCareers.types'

const mapTypeToEnum = (type: StudentFileType): FileType | null => {
  switch (type) {
    case 'course_descriptions':
      return FileType.COURSE_DESCRIPTIONS
    case 'diploma':
      return FileType.DIPLOMA
    case 'diploma_supplement':
      return FileType.DIPLOMA_SUPPLEMENT
    case 'transcript':
      return FileType.TRANSCRIPT
    default:
      return null
  }
}

export const mapToStudent = (
  data: StudentTrackDto,
  institution: InstitutionProps,
): StudentTrackTranscript | null => {
  if (
    !data ||
    !data?.name ||
    !data?.graduationDate ||
    !data?.trackNumber ||
    !data?.school ||
    !data?.faculty
  ) {
    return null
  }

  let institutionMapped: Institution | undefined

  if (data.institution?.id) {
    institutionMapped = {
      id: data.institution.id,
      shortId: data.institution.idShort,
      displayName: institution.displayName,
      logoUrl: institution.logoUrl,
    }
  } else {
    institutionMapped = institution
  }

  return {
    name: data.name,
    trackNumber: data.trackNumber,
    institution: institutionMapped,
    school: data.school,
    faculty: data.faculty,
    studyProgram: data.studyProgram,
    degree: data.degree,
    graduationDate: data.graduationDate.toISOString(),
  }
}

export const mapToStudentTrackModel = (
  data: StudentTrackOverviewDto,
  institution: InstitutionProps,
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
          const type = mapTypeToEnum(d.type)
          if (!type || !d.locale || !d.displayName || !d.fileName) {
            return null
          }

          return {
            type,
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
