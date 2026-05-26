import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { nationalIdsMatch } from './helpers'
import { EstateMember } from '../../types'

const HEIRS_DATA_PATH = 'heirs.data'

export const getAssigneesNationalIdList = (
  application: Application,
  membersPath: string = HEIRS_DATA_PATH,
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
