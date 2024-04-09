import {
  BifrostStudentTrackInstitution,
  HIStudentTrackInstitution,
  HolarStudentTrackInstitution,
  LbhiStudentTrackInstitution,
  UnakStudentTrackInstitution,
} from '../clients'

export interface StudentTrackInstitutionDto {
  id?: string
  displayName?: string
}

export const mapToStudentTrackInstitutionDto = (
  institution?:
    | HolarStudentTrackInstitution
    | LbhiStudentTrackInstitution
    | BifrostStudentTrackInstitution
    | UnakStudentTrackInstitution
    | HIStudentTrackInstitution,
): StudentTrackInstitutionDto | undefined => {
  if (!institution?.id || !institution?.displayName) {
    return
  }

  return institution
}
