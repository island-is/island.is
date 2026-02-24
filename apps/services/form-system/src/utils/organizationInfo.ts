import {
  InstitutionNationalIds,
  InstitutionContentfulIds,
  InstitutionTypes,
} from '@island.is/application/types'

export const getOrganizationInfoByNationalId = (nationalId?: string) => {
  if (!nationalId) {
    return null
  }

  // Find the key that matches the given nationalId
  const key = Object.entries(InstitutionNationalIds).find(
    ([_, value]) => value === nationalId,
  )?.[0]

  if (!key) {
    return null
  }

  return {
    contentfulId:
      InstitutionContentfulIds[key as keyof typeof InstitutionContentfulIds],
    type: InstitutionTypes[key as keyof typeof InstitutionTypes],
    nationalId:
      InstitutionNationalIds[key as keyof typeof InstitutionNationalIds],
  }
}
