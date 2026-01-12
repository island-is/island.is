import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { SecondarySchool } from '../types'

export const getSchoolsData = (
  externalData: ExternalData,
): SecondarySchool[] => {
  const schoolOptions = getValueViaPath<SecondarySchool[]>(
    externalData,
    'schools.data',
  )

  if (!Array.isArray(schoolOptions)) return []

  return schoolOptions
}
