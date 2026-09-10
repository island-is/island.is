import { useCallback } from 'react'

import type { UpdateCaseAppealDecisionInput } from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { normalizeBlankStrings } from '../../formatters'
import { useUpdateCaseAppealDecisionMutation } from './updateCaseAppealDecision.generated'

const useCaseAppealDecision = () => {
  const [updateCaseAppealDecisionMutation] =
    useUpdateCaseAppealDecisionMutation()

  const updateCaseAppealDecision = useCallback(
    async (input: UpdateCaseAppealDecisionInput) => {
      try {
        const { data } = await updateCaseAppealDecisionMutation({
          variables: { input: normalizeBlankStrings(input) },
        })

        return data?.updateCaseAppealDecision
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra ákvörðun um kæru')

        return undefined
      }
    },
    [updateCaseAppealDecisionMutation],
  )

  return { updateCaseAppealDecision }
}

export default useCaseAppealDecision
