import {
  BifrostStudentTrackInstitution,
  HIStudentTrackInstitution,
  HolarStudentTrackInstitution,
  LbhiStudentTrackInstitution,
  UnakStudentTrackInstitution,
} from '../clients'
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
  institution?:
    | HolarStudentTrackInstitution
    | LbhiStudentTrackInstitution
    | BifrostStudentTrackInstitution
    | UnakStudentTrackInstitution
    | HIStudentTrackInstitution,
): StudentTrackInstitutionDto | undefined => {
  return {
    ...institution,
    id: institutionId,
    idShort: UniversityIdMap[institutionId],
  }
}
