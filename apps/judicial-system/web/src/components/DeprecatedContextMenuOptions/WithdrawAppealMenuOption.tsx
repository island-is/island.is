import { FC, useState } from 'react'
import { useIntl } from 'react-intl'

import { IconMapIcon } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'

import {
  AppealCaseState,
  CaseListEntry,
  CaseTransition,
} from '../../graphql/schema'
import { useCase } from '../../utils/hooks'
import Modal from '../Modals/Modal/Modal'
import { strings } from './WithdrawAppealMenuOption.strings'

interface WithdrawAppealModalProps {
  caseId: string
  cases: CaseListEntry[]
  onClose: () => void
}

export const useWithdrawAppealMenuOption = () => {
  const [caseToWithdraw, setCaseToWithdraw] = useState<string | undefined>()

  const { formatMessage } = useIntl()

  const withdrawAppealMenuOption = (caseId: string) => {
    return {
      title: formatMessage(strings.withdrawAppeal),
      icon: 'trash' as IconMapIcon,
      onClick: () => {
        setCaseToWithdraw(caseId)
      },
    }
  }

  const shouldDisplayWithdrawAppealOption = (
    caseEntry: CaseListEntry,
    userNationalId?: string | null,
  ) => {
    const withdrawableCaseStates = [
      AppealCaseState.APPEALED,
      AppealCaseState.RECEIVED,
    ]

    if (
      !caseEntry.appealState ||
      !withdrawableCaseStates.includes(caseEntry.appealState)
    ) {
      return false
    }

    if (!caseEntry.accusedPostponedAppealDate) {
      return false
    }

    // For indictment cases, only the specific defender who appealed can withdraw
    if (isIndictmentCase(caseEntry.type)) {
      return (
        Boolean(caseEntry.appealedByNationalId) &&
        caseEntry.appealedByNationalId === userNationalId
      )
    }

    return true
  }

  return {
    caseToWithdraw,
    setCaseToWithdraw,
    withdrawAppealMenuOption,
    shouldDisplayWithdrawAppealOption,
  }
}

const WithdrawAppealContextMenuModal: FC<WithdrawAppealModalProps> = (
  props,
) => {
  const { caseId, cases, onClose } = props
  const { formatMessage } = useIntl()
  const { transitionCase, isTransitioningCase } = useCase()

  const handleWithdrawAppealClick = async () => {
    const transitionResult = await transitionCase(
      caseId,
      CaseTransition.WITHDRAW_APPEAL,
    )
    if (transitionResult === true) {
      const transitionedCase = cases.find((tc) => caseId === tc.id)
      if (transitionedCase) {
        transitionedCase.appealState = AppealCaseState.WITHDRAWN
      }
      onClose()
    }
  }

  return (
    <Modal
      title={formatMessage(strings.withdrawAppealModalTitle)}
      text={formatMessage(strings.withdrawAppealModalText)}
      primaryButton={{
        text: formatMessage(strings.withdrawAppealModalPrimaryButtonText),
        onClick: handleWithdrawAppealClick,
        isLoading: isTransitioningCase,
        colorScheme: 'destructive',
      }}
      secondaryButton={{
        text: formatMessage(strings.withdrawAppealModalSecondaryButtonText),
        onClick: () => onClose(),
      }}
    />
  )
}

export default WithdrawAppealContextMenuModal
