import { useState } from 'react'

import {
  ContextMenuItem,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { CaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

export const useDeleteCase = (onComplete: (caseId: string) => void) => {
  const [deleteCaseId, setDeleteCaseId] = useState<string>()
  const { transitionCase, isTransitioningCase } = useCase()

  const deleteCase = (caseId: string): ContextMenuItem => {
    return {
      title: 'Afturkalla mál',
      onClick: () => {
        if (deleteCaseId) {
          return
        }

        setDeleteCaseId(caseId)
      },
      icon: 'trash',
    }
  }

  const handlePrimaryButtonClick = async () => {
    if (!deleteCaseId) {
      return
    }

    const deleted = await transitionCase(deleteCaseId, CaseTransition.DELETE)

    if (!deleted) {
      return
    }

    onComplete(deleteCaseId)

    setDeleteCaseId(undefined)
  }

  const handleSecondaryButtonClick = () => {
    setDeleteCaseId(undefined)
  }

  const deleteCaseModal = deleteCaseId && (
    <Modal
      title="Afturkalla mál"
      text="Ertu viss um að þú viljir afturkalla þetta mál?"
      primaryButtonText="Afturkalla"
      primaryButtonColorScheme="destructive"
      onPrimaryButtonClick={handlePrimaryButtonClick}
      isPrimaryButtonLoading={isTransitioningCase}
      secondaryButtonText="Hætta við"
      onSecondaryButtonClick={handleSecondaryButtonClick}
    />
  )

  return {
    deleteCase,
    deleteCaseModal,
  }
}
