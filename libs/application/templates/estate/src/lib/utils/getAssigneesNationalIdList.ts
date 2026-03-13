import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { EstateMember } from '../../types'
import { nationalIdsMatch } from './helpers'

const ESTATE_MEMBERS_PATH = 'estate.estateMembers'

export const getAssigneesNationalIdList = (
  application: Application,
  membersPath: string = ESTATE_MEMBERS_PATH,
): string[] => {
  const assigneesNationalIdList: string[] = []

  const members = getValueViaPath<EstateMember[]>(
    application.answers,
    membersPath,
    [],
  )

  members?.forEach(({ nationalId, enabled, approved }) => {
    if (!nationalId || enabled === false) return
    if (approved === true) return
    if (nationalIdsMatch(nationalId, application.applicant)) return

    assigneesNationalIdList.push(nationalId)
  })

  return assigneesNationalIdList
}
