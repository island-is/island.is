import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { IconMapIcon } from '@island.is/island-ui/core'
import {
  isDefenceUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'

import {
  CaseAppealState,
  CaseListEntry,
  CaseTransition,
} from '../../../graphql/schema'
import { useCase } from '../../../utils/hooks'
import { ModalProps } from '../../Modal/Modal'
import { UserContext } from '../../UserProvider/UserProvider'
import { strings } from './WithdrawAppealMenuOption.strings'

export const useWithdrawAppealMenuOption = () => {
  const { transitionCase, isTransitioningCase } = useCase()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const [modalVisible, setVisibleModal] = useState<boolean>(false)
  const [modalOptions, setModalOptions] = useState<ModalProps>()

  const shouldDisplayWithdrawAppealOption = useCallback(
    (caseEntry: CaseListEntry) => {
      const isProsecution = isProsecutionUser(user)
      const withdrawableCaseStates = [
        CaseAppealState.APPEALED,
        CaseAppealState.RECEIVED,
      ]

      if (
        (!isProsecution && !isDefenceUser(user)) ||
        !caseEntry.appealState ||
        !withdrawableCaseStates.includes(caseEntry.appealState)
      ) {
        return false
      }

      return Boolean(
        isProsecution
          ? caseEntry.prosecutorPostponedAppealDate
          : caseEntry.accusedPostponedAppealDate,
      )
    },
    [user],
  )

  const withdrawAppealMenuOption = (caseId: string, cases: CaseListEntry[]) => {
    return {
      title: formatMessage(strings.withdrawAppeal),
      onClick: () => {
        handleWithdrawAppealMenuClick(caseId, cases)
      },
      icon: 'trash' as IconMapIcon,
    }
  }

  const handleWithdrawAppealMenuClick = (
    id: string,
    cases: CaseListEntry[],
  ) => {
    setVisibleModal(true)
    setModalOptions(withdrawAppealOptionModal(id, cases, setVisibleModal))
  }

  const withdrawAppealOptionModal = (
    caseId: string,
    cases: CaseListEntry[],
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
  ): ModalProps => {
    return {
      title: formatMessage(strings.withdrawAppealModalTitle),
      text: formatMessage(strings.withdrawAppealModalText),
      primaryButtonText: formatMessage(
        strings.withdrawAppealModalPrimaryButtonText,
      ),
      secondaryButtonText: formatMessage(
        strings.withdrawAppealModalSecondaryButtonText,
      ),

      onPrimaryButtonClick: async () => {
        const transitionResult = await transitionCase(
          caseId,
          CaseTransition.WITHDRAW_APPEAL,
        )

        if (transitionResult === true) {
          const transitionedCase = cases.find((tc) => caseId === tc.id)
          if (transitionedCase) {
            transitionedCase.appealState = CaseAppealState.WITHDRAWN
          }
          setVisibleModal && setVisibleModal(false)
        }
      },
      onSecondaryButtonClick: () => {
        setVisibleModal(false)
      },
      primaryButtonColorScheme: 'destructive',
    }
  }

  return {
    withdrawAppealMenuOption,
    shouldDisplayWithdrawAppealOption,
    isWithdrawnAppealModalVisible: modalVisible,
    modalOptions,
    isTransitioningCase,
  }
}

export default useWithdrawAppealMenuOption
