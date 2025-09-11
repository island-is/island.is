import { FC, useState } from 'react'
import { useIntl } from 'react-intl'

import { IconMapIcon } from '@island.is/island-ui/core'

import {
  CaseAppealState,
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

  const shouldDisplayWithdrawAppealOption = (caseEntry: CaseListEntry) => {
    const withdrawableCaseStates = [
      CaseAppealState.APPEALED,
      CaseAppealState.RECEIVED,
    ]

    if (
      !caseEntry.appealState ||
      !withdrawableCaseStates.includes(caseEntry.appealState)
    ) {
      return false
    }

    return Boolean(caseEntry.accusedPostponedAppealDate)
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
        transitionedCase.appealState = CaseAppealState.WITHDRAWN
      }
      onClose()
    }
  }

  return (
    <Modal
      title={formatMessage(strings.withdrawAppealModalTitle)}
      text={formatMessage(strings.withdrawAppealModalText)}
      primaryButtonText={formatMessage(
        strings.withdrawAppealModalPrimaryButtonText,
      )}
      secondaryButtonText={formatMessage(
        strings.withdrawAppealModalSecondaryButtonText,
      )}
      isPrimaryButtonLoading={isTransitioningCase}
      onPrimaryButtonClick={handleWithdrawAppealClick}
      onSecondaryButtonClick={() => {
        onClose()
      }}
      primaryButtonColorScheme="destructive"
    ></Modal>
  )
}

export default WithdrawAppealContextMenuModal
