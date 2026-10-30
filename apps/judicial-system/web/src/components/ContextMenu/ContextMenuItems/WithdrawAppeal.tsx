import { useState } from 'react'

import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components'
import { Modal } from '@island.is/judicial-system-web/src/components'
import { AppealCaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import { useAppealCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface WithdrawAppealIds {
  caseId: string
  appealCaseId: string
}

export const useWithdrawAppeal = (onComplete: () => void) => {
  const [withdrawAppealIds, setWithdrawAppealIds] =
    useState<WithdrawAppealIds>()
  const { transitionAppealCase, isTransitioningAppealCase } = useAppealCase()

  const withdrawAppeal = (
    caseId: string,
    appealCaseId: string,
  ): ContextMenuItem => {
    return {
      title: 'Afturkalla kæru',
      icon: 'trash',
      onClick: () => {
        if (withdrawAppealIds) {
          return
        }

        setWithdrawAppealIds({ caseId, appealCaseId })
      },
    }
  }

  const handlePrimaryButtonClick = async () => {
    if (!withdrawAppealIds) {
      return
    }

    const appealWithdrawn = await transitionAppealCase(
      withdrawAppealIds.caseId,
      withdrawAppealIds.appealCaseId,
      AppealCaseTransition.WITHDRAW_APPEAL,
    )

    if (!appealWithdrawn) {
      return
    }

    onComplete()

    setWithdrawAppealIds(undefined)
  }

  const handleSecondaryButtonClick = () => {
    setWithdrawAppealIds(undefined)
  }

  const WithdrawAppealModal = withdrawAppealIds && (
    <Modal
      title="Afturkalla kæru"
      text="Ertu viss um að þú viljir afturkalla þessa kæru?"
      buttons={[
        {
          text: 'Hætta við',
          onClick: handleSecondaryButtonClick,
          variant: 'ghost',
        },
        {
          text: 'Afturkalla',
          onClick: handlePrimaryButtonClick,
          colorScheme: 'destructive',
          isLoading: isTransitioningAppealCase,
        },
      ]}
    />
  )

  return { withdrawAppeal, WithdrawAppealModal }
}
