import { ApplicantsInfo } from '@island.is/application/templates/rental-agreement'

export const formatPhoneNumber = (phone: string) => {
  return phone
    .trim()
    .replace(/(^00354|^\+354)/g, '') // Remove country code
    .replace(/\D/g, '') // Remove all non-digits
}

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
