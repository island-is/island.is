import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { EstateMember } from '../../types'

export const allPartiesHaveApproved = (answers: FormValue): boolean => {
  const estateMembers = getValueViaPath<EstateMember[]>(
    answers,
    'estate.estateMembers',
    [],
  )

  // Filter to only enabled estate members
  const enabledMembers = estateMembers?.filter((member) => member.enabled !== false)

  // If no enabled members, return true (no one needs to approve)
  if (!enabledMembers || enabledMembers.length === 0) {
    return true
  }

  // Check if all enabled members have approved
  return enabledMembers.every((member) => member.approved === true)
}
