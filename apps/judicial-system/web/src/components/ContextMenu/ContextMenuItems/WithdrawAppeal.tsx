import { useState } from 'react'

import {
  ContextMenuItem,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { CaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

export const useWithdrawAppeal = (onComplete: () => void) => {
  const [withdrawAppealCaseId, setWithdrawAppealCaseId] = useState<string>()
  const { transitionCase, isTransitioningCase } = useCase()

  const withdrawAppeal = (caseId: string): ContextMenuItem => {
    return {
      title: 'Afturkalla kæru',
      icon: 'trash',
      onClick: () => {
        if (withdrawAppealCaseId) {
          return
        }

        setWithdrawAppealCaseId(caseId)
      },
    }
  }

  const handlePrimaryButtonClick = async () => {
    if (!withdrawAppealCaseId) {
      return
    }

    const appealWithdrawn = await transitionCase(
      withdrawAppealCaseId,
      CaseTransition.WITHDRAW_APPEAL,
    )

    if (!appealWithdrawn) {
      return
    }

    onComplete()

    setWithdrawAppealCaseId(undefined)
  }

  const handleSecondaryButtonClick = () => {
    setWithdrawAppealCaseId(undefined)
  }

  const WithdrawAppealModal = withdrawAppealCaseId && (
    <Modal
      title="Afturkalla kæru"
      text="Ertu viss um að þú viljir afturkalla þessa kæru?"
      primaryButtonText="Afturkalla"
      primaryButtonColorScheme="destructive"
      onPrimaryButtonClick={handlePrimaryButtonClick}
      isPrimaryButtonLoading={isTransitioningCase}
      secondaryButtonText="Hætta við"
      onSecondaryButtonClick={handleSecondaryButtonClick}
    />
  )

  return { withdrawAppeal, WithdrawAppealModal }
}
