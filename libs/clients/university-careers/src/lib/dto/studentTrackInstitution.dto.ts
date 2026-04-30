import type { StudentTrack } from '../../../gen/fetch'
import {
  UniversityId,
  UniversityIdMap,
  UniversityIdShort,
} from '../universityCareers.types'

export interface StudentTrackInstitutionDto {
  id: UniversityId
  idShort: UniversityIdShort
  displayName?: string
}

export const mapToStudentTrackInstitutionDto = (
  institutionId: UniversityId,
  institution?: StudentTrack['institution'],
): StudentTrackInstitutionDto | undefined => {
  return {
    ...institution,
    id: institutionId,
    idShort: UniversityIdMap[institutionId],
  }
}
