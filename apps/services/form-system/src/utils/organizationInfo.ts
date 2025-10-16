import {
  InstitutionNationalIds,
  InstitutionContentfulIds,
  InstitutionTypes,
} from '@island.is/application/types'
import { NotFoundException } from '@nestjs/common'

export const getOrganizationInfoByNationalId = (nationalId: string) => {
  if (!nationalId) {
    throw new Error('nationalId is required')
  }

  // Find the key that matches the given nationalId
  const key = Object.entries(InstitutionNationalIds).find(
    ([_, value]) => value === nationalId,
  )?.[0]

  if (!key) {
    throw new NotFoundException(`key not found for nationalId: ${nationalId}`)
  }

  return {
    contentfulId:
      InstitutionContentfulIds[key as keyof typeof InstitutionContentfulIds],
    type: InstitutionTypes[key as keyof typeof InstitutionTypes],
    nationalId:
      InstitutionNationalIds[key as keyof typeof InstitutionNationalIds],
  }
}
