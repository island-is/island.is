import { Dispatch, SetStateAction, useContext, useState } from 'react'

import { Box, toast } from '@island.is/island-ui/core'
import {
  FormContext,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseIndictmentRulingDecision,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { CourtCaseNumberInput } from '../../Court/components'

export const useCancelCase = (onComplete: (caseId: string) => void) => {
  const { getCase } = useContext(FormContext)
  const [caseToCancel, setCaseToCancel] = useState<
    [
      cancelCaseId: string | undefined,
      isCancelCaseLoading: boolean,
      theCase: Case | undefined,
    ]
  >([undefined, false, undefined])
  const { updateCase, isUpdatingCase, transitionCase, isTransitioningCase } =
    useCase()

  const cancelCase = async (caseId: string) => {
    setCaseToCancel((prev) => {
      const [cancelCaseId] = prev

      if (cancelCaseId) {
        return prev
      }

      const timeout = setTimeout(
        () =>
          setCaseToCancel(([cancelCaseId, _, theCase]) => [
            cancelCaseId,
            true,
            theCase,
          ]),
        2000,
      )

      getCase(
        caseId,
        (theCase) => {
          clearTimeout(timeout)
          setCaseToCancel(([cancelCaseId]) => [cancelCaseId, false, theCase])
        },
        () => {
          clearTimeout(timeout)
          setCaseToCancel([undefined, false, undefined])

          toast.error('Upp kom villa við að sækja mál')
        },
      )

      return [caseId, false, undefined]
    })
  }

  const handlePrimaryButtonClick = async () => {
    const [cancelCaseId] = caseToCancel

    if (!cancelCaseId) {
      return
    }

    const updated = await updateCase(cancelCaseId, {
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
    })

    if (!updated) {
      return
    }

    const cancelled = await transitionCase(
      cancelCaseId,
      CaseTransition.COMPLETE,
    )

    if (!cancelled) {
      return
    }

    onComplete(cancelCaseId)

    setCaseToCancel([undefined, false, undefined])
  }

  const handleSecondaryButtonClick = () => {
    setCaseToCancel([undefined, false, undefined])
  }

  const setWorkingCase: Dispatch<SetStateAction<Case>> = (action) =>
    setCaseToCancel(([cancelCaseId, isCancelCaseLoading, theCase]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newCase = typeof action === 'function' ? action(theCase!) : action // We know the case is set at this point

      return [cancelCaseId, isCancelCaseLoading, newCase]
    })

  const [cancelCaseId, isCancelCaseLoading, theCase] = caseToCancel

  const CancelCaseModal = () =>
    theCase && (
      <Modal
        title="Mál afturkallað"
        text="Ákæruvaldið hefur afturkallað ákæruna. Hægt er að skrá málsnúmer og ljúka málinu hér."
        primaryButtonText="Ljúka máli"
        onPrimaryButtonClick={handlePrimaryButtonClick}
        isPrimaryButtonLoading={isUpdatingCase || isTransitioningCase}
        secondaryButtonText="Hætta við"
        onSecondaryButtonClick={handleSecondaryButtonClick}
      >
        <Box marginBottom={8}>
          <CourtCaseNumberInput
            workingCase={theCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </Modal>
    )

  return { cancelCase, cancelCaseId, isCancelCaseLoading, CancelCaseModal }
}
