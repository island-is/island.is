import { ApplicantsInfo } from './types'

export const filterNonRepresentativesAndMapInfo = (
  applicants: Array<ApplicantsInfo> = [],
) => {
  return applicants
    .filter(
      ({ isRepresentative }) => !isRepresentative?.includes('isRepresentative'),
    )
    .map((applicant) => ({
      name: applicant.nationalIdWithName.name,
      address: applicant.email,
    }))
}
