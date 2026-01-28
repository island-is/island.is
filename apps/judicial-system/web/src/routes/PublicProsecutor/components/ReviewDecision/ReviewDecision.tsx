import { Dispatch, FC, SetStateAction, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { RadioButton } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { ConfirmationModal, isConfirmProsecutorDecisionModal } from '../utils'
import { strings } from './ReviewDecision.strings'
import * as styles from './ReviewDecision.css'

interface Props {
  caseId: string
  defendant: Defendant
  modalVisible?: ConfirmationModal
  setModalVisible: Dispatch<SetStateAction<ConfirmationModal | undefined>>
  isFine: boolean
}

export const ReviewDecision: FC<Props> = (props) => {
  const { caseId, defendant, modalVisible, setModalVisible, isFine } = props

  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateDefendant, updateDefendantState } = useDefendants()

  const handleReviewDecision = async () => {
    if (!defendant.indictmentReviewDecision) {
      return
    }
    const promises = []

    for (const d of workingCase.defendants || []) {
      if (!d.indictmentReviewDecision) {
        return
      }
      promises.push(
        updateDefendant({
          caseId,
          defendantId: d.id,
          indictmentReviewDecision: d.indictmentReviewDecision,
        }),
      )
    }

    const results = await Promise.all(promises)
    const updateSuccess = results.every((result) => result)

    if (!updateSuccess) {
      return
    }

    router.push(getStandardUserDashboardRoute(user))
  }

  if (!(isPublicProsecutionUser(user) || isPublicProsecutionOfficeUser(user))) {
    return null
  }

  return (
    <>
      <div className={styles.gridRow}>
        <RadioButton
          id={`review-option-appeal-${defendant.id}`}
          name={`review-option-appeal-${defendant.id}`}
          label={
            isFine
              ? 'Kæra viðurlagaákvörðun til Landsréttar'
              : 'Áfrýja héraðsdómi til Landsréttar'
          }
          value={IndictmentCaseReviewDecision.APPEAL}
          checked={
            defendant.indictmentReviewDecision ===
            IndictmentCaseReviewDecision.APPEAL
          }
          onChange={() =>
            updateDefendantState(
              {
                caseId,
                defendantId: defendant.id,
                indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
              },
              setWorkingCase,
            )
          }
          backgroundColor="white"
          large
        />
        <RadioButton
          id={`review-option-accept-${defendant.id}`}
          name={`review-option-accept-${defendant.id}`}
          label={isFine ? 'Una viðurlagaákvörðun' : 'Una héraðsdómi'}
          value={IndictmentCaseReviewDecision.ACCEPT}
          checked={
            defendant.indictmentReviewDecision ===
            IndictmentCaseReviewDecision.ACCEPT
          }
          onChange={() =>
            updateDefendantState(
              {
                caseId,
                defendantId: defendant.id,
                indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
              },
              setWorkingCase,
            )
          }
          backgroundColor="white"
          large
        />
      </div>
      {isConfirmProsecutorDecisionModal(modalVisible) && (
        <Modal
          title={fm(strings.reviewModalTitle)}
          text="Ertu viss um að þú viljir ljúka yfirlestri?"
          primaryButton={{
            text: fm(strings.reviewModalPrimaryButtonText),
            onClick: handleReviewDecision,
          }}
          secondaryButton={{
            text: fm(strings.reviewModalSecondaryButtonText),
            onClick: () => setModalVisible(undefined),
          }}
          onClose={() => setModalVisible(undefined)}
        />
      )}
    </>
  )
}
