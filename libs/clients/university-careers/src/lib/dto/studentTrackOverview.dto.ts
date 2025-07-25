import { isDefined } from '@island.is/shared/utils'
import {
  HolarStudentTrackOverview,
  LbhiStudentTrackOverview,
  BifrostStudentTrackOverview,
  UnakStudentTrackOverview,
  HIStudentTrackOverview,
} from '../clients'
import { UniversityId } from '../universityCareers.types'
import { StudentFileDto, mapToStudentFileDto } from './studentFileDto'
import { StudentTrackDto, mapToStudentTrackDto } from './studentTrack.dto'
import { StudentTrackOverviewBodyDto } from './studentTrackOverviewBody.dto'

export interface StudentTrackOverviewDto {
  transcript: StudentTrackDto
  files: Array<StudentFileDto>
  body?: StudentTrackOverviewBodyDto
}

export const mapToStudentTrackOverviewDto = (
  overview:
    | HolarStudentTrackOverview
    | LbhiStudentTrackOverview
    | BifrostStudentTrackOverview
    | UnakStudentTrackOverview
    | HIStudentTrackOverview,
  institutionId: UniversityId,
): StudentTrackOverviewDto | null => {
  if (!overview.transcript) {
    return null
  }

  const studentTrack = mapToStudentTrackDto(overview.transcript, institutionId)

  if (!studentTrack) {
    return null
  }

  return {
    transcript: studentTrack,
    files: overview.files
      ? overview.files.map((f) => mapToStudentFileDto(f)).filter(isDefined)
      : [],
    body: { ...overview.body },
  }
}
