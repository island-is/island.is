import { useContext, useState } from 'react'

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
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

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

  const setCourtCaseNumber = (courtCaseNumber: string) =>
    setCaseToCancel(([cancelCaseId, isCancelCaseLoading, prevCase]) => {
      return [
        cancelCaseId,
        isCancelCaseLoading,
        // Should have a case, but guarding anyway
        prevCase && { ...prevCase, courtCaseNumber },
      ]
    })

  const [cancelCaseId, isCancelCaseLoading, theCase] = caseToCancel

  const CancelCaseModal = cancelCaseId && theCase && (
    <Modal
      title="Mál afturkallað"
      text="Ákæruvaldið hefur afturkallað ákæruna. Hægt er að skrá málsnúmer og ljúka málinu hér."
      primaryButton={{
        text: 'Ljúka máli',
        onClick: handlePrimaryButtonClick,
        isLoading: isUpdatingCase || isTransitioningCase,
        isDisabled:
          !validate([[theCase.courtCaseNumber, ['empty', 'S-case-number']]])
            .isValid ||
          isUpdatingCase ||
          isTransitioningCase,
      }}
      secondaryButton={{
        text: 'Hætta við',
        onClick: handleSecondaryButtonClick,
      }}
    >
      <Box marginBottom={8}>
        <CourtCaseNumberInput
          caseId={cancelCaseId}
          isIndictmentCase={true}
          courtCaseNumber={theCase.courtCaseNumber}
          isDisabled={isUpdatingCase || isTransitioningCase}
          setCourtCaseNumber={setCourtCaseNumber}
        />
      </Box>
    </Modal>
  )

  return { cancelCase, cancelCaseId, isCancelCaseLoading, CancelCaseModal }
}
