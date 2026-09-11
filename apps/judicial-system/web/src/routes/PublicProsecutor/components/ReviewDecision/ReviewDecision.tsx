import type { FC } from 'react'
import { useContext } from 'react'

import { RadioButton } from '@island.is/island-ui/core'
import {
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { IndictmentCaseReviewDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './ReviewDecision.css'

interface Props {
  caseId: string
  defendant: Defendant
  isFine: boolean
}

/**
 * One defendant's review decision - appeal or accept - as a radio pair. Only
 * the working case changes here; the decisions of the whole case are confirmed
 * and saved together by ReviewDecisionModal.
 */
export const ReviewDecision: FC<Props> = (props) => {
  const { caseId, defendant, isFine } = props

  const { user } = useContext(UserContext)
  const { setWorkingCase } = useContext(FormContext)
  const { updateDefendantState } = useDefendants()

  if (!(isPublicProsecutionUser(user) || isPublicProsecutionOfficeUser(user))) {
    return null
  }

  const choose = (indictmentReviewDecision: IndictmentCaseReviewDecision) =>
    updateDefendantState(
      { caseId, defendantId: defendant.id, indictmentReviewDecision },
      setWorkingCase,
    )

  return (
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
        onChange={() => choose(IndictmentCaseReviewDecision.APPEAL)}
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
        onChange={() => choose(IndictmentCaseReviewDecision.ACCEPT)}
        backgroundColor="white"
        large
      />
    </div>
  )
}
