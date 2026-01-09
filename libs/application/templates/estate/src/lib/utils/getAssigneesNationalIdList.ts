import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { EstateMember } from '../../types'

export const getAssigneesNationalIdList = (
  application: Application,
): string[] => {
  const assigneesNationalIdList: string[] = []

  const estateMembers = getValueViaPath<EstateMember[]>(
    application.answers,
    'estate.estateMembers',
    [],
  )

  estateMembers?.forEach(({ nationalId, enabled, approved }) => {
    // Only include enabled members
    if (!nationalId || enabled === false) return

    // Don't assign members that have already approved
    if (approved === true) return

    // Filter out the applicant if they are also a member
    if (nationalId === application.applicant) return

    assigneesNationalIdList.push(nationalId)
  })

  return assigneesNationalIdList
}
