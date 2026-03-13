import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { EstateMember } from '../../types'

const ESTATE_MEMBERS_PATH = 'estate.estateMembers'

export const allPartiesHaveApproved = (
  answers: FormValue,
  membersPath: string = ESTATE_MEMBERS_PATH,
): boolean => {
  const members = getValueViaPath<EstateMember[]>(answers, membersPath, [])

  const enabledMembers = members?.filter(
    (member) => member.enabled !== false,
  )

  if (!enabledMembers || enabledMembers.length === 0) {
    return true
  }

  return enabledMembers.every((member) => member.approved === true)
}
