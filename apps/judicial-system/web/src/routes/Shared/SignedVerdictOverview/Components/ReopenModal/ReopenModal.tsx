import { useContext } from 'react'
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

interface Props {
  onClose: () => void
}

const ReopenModal: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const { transitionCase, isTransitioningCase } = useCase()

  return (
    <Modal
      title="Leiðrétta úrskurð"
      text="Ef þú gerir þetta þá #$%&"
      primaryButtonText="Leiðrétta"
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
      secondaryButtonText="Hætta við"
      onSecondaryButtonClick={onClose}
    />
  )
}

export default ReopenModal
