import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { EstateMember } from '../../types'

export const allPartiesHaveApproved = (answers: FormValue): boolean => {
  const heirs = getValueViaPath<EstateMember[]>(
    answers,
    'heirs.data',
    [],
  )

  // Filter to only enabled heirs
  const enabledHeirs = heirs?.filter((heir) => heir.enabled !== false)

  // If no enabled heirs, return true (no one needs to approve)
  if (!enabledHeirs || enabledHeirs.length === 0) {
    return true
  }

  // Check if all enabled heirs have approved
  return enabledHeirs.every((heir) => heir.approved === true)
}

