import invertBy from 'lodash/invertBy'
import { Institution, institutionMapper } from '@island.is/application/types'

export const getTypeIdsForInstitution = (nationalId: string): string[] => {
  const institutions = invertBy(
    institutionMapper,
    (application) => application.nationalId,
  )
  return institutions[nationalId]
}

export const getInstitutionsWithApplicationTypes = (): Institution[] => {
  const result = new Map<string, Institution>()

  for (const [applicationType, institution] of Object.entries(
    institutionMapper,
  )) {
    const key = institution.slug // group by slug (or nationalId if preferred)

    if (!result.has(key)) {
      result.set(key, {
        ...institution,
        applicationTypes: [],
      })
    }

    result.get(key)?.applicationTypes.push(applicationType)
  }

  return Array.from(result.values())
}
