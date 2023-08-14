import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseTransition,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
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
  const { transitionCase, isTransitioningCase } = useCase()

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={formatMessage(strings.text)}
      primaryButtonText={formatMessage(strings.continue)}
      isPrimaryButtonLoading={isTransitioningCase}
      onPrimaryButtonClick={async () => {
        const caseTransitioned = await transitionCase(
          workingCase.id,
          CaseTransition.REOPEN,
        )

        if (caseTransitioned) {
          router.push(
            isRestrictionCase(workingCase.type)
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
