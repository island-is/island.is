import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  COURT_OF_APPEAL_CASE_ROUTE,
  INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseTransition,
  isCourtOfAppealsUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './ReopenModal.strings'

interface Props {
  onClose: () => void
}

const ReopenModal: React.FC<React.PropsWithChildren<Props>> = ({ onClose }) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { transitionCase, isTransitioningCase } = useCase()

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={
        isCourtOfAppealsUser(user)
          ? formatMessage(strings.reopenAppealText)
          : formatMessage(strings.reopenCaseText)
      }
      primaryButtonText={formatMessage(strings.continue)}
      isPrimaryButtonLoading={isTransitioningCase}
      onPrimaryButtonClick={async () => {
        const caseTransitioned = await transitionCase(
          workingCase.id,
          isCourtOfAppealsUser(user)
            ? CaseTransition.REOPEN_APPEAL
            : CaseTransition.REOPEN,
        )

        if (caseTransitioned) {
          router.push(
            isCourtOfAppealsUser(user)
              ? `${COURT_OF_APPEAL_CASE_ROUTE}/${workingCase.id}`
              : isRestrictionCase(workingCase.type)
              ? `${RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`
              : `${INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`,
          )
        }
      }}
      secondaryButtonText={formatMessage(strings.cancel)}
      onSecondaryButtonClick={onClose}
    />
  )
}

export default ReopenModal
