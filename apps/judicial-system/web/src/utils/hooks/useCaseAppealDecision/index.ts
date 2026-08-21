import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { UpdateCaseAppealDecisionInput } from '@island.is/judicial-system-web/src/graphql/schema'

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
