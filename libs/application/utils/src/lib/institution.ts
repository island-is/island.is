import { institutionMapper } from '@island.is/application/types'
import invertBy from 'lodash/invertBy'

export const getTypeIdsForInstitution = (nationalId: string): string[] => {
  const institutions = invertBy(
    institutionMapper,
    (application) => application.nationalId,
  )
  return institutions[nationalId]
}
