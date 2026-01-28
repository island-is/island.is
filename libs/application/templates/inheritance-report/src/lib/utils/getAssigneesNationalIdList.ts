import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { nationalIdsMatch } from './helpers'
import { EstateMember } from '../../types'

export const getAssigneesNationalIdList = (
  application: Application,
): string[] => {
  const assigneesNationalIdList: string[] = []

  const heirs = getValueViaPath<EstateMember[]>(
    application.answers,
    'heirs.data',
    [],
  )

  heirs?.forEach(({ nationalId, enabled, approved }) => {
    // Only include enabled heirs
    if (!nationalId || enabled === false) return

    // Don't assign heirs that have already approved
    if (approved === true) return

    // Filter out the applicant if they are also a heir
    if (nationalIdsMatch(nationalId, application.applicant)) return

    assigneesNationalIdList.push(nationalId)
  })

  return assigneesNationalIdList
}

