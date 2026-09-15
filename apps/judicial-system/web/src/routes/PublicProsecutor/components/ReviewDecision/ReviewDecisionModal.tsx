import type { FC } from 'react'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Modal } from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'

import type {
  ReviewDecisions,
  VerdictAppealActions,
} from './ReviewDecision.logic'
import {
  getReviewDecisionLabel,
  getVerdictAppealActions,
  isLateVerdictAppeal,
} from './ReviewDecision.logic'
import { strings } from './ReviewDecision.strings'

interface Props {
  caseId: string
  // The defendants whose review decision changed - the only ones saved.
  changedDefendants: Defendant[]
  // What the decisions were when the page loaded, which is what makes a change
  // away from an appeal a withdrawal rather than nothing at all.
  originalDecisions: ReviewDecisions
  isFine: boolean
  // The prosecution's own deadline to appeal. Passing it late is allowed, and
  // only changes what the confirmation says.
  indictmentAppealDeadline?: string | null
  // The verdict appeal case of this case, if one has been made. Withdrawing
  // needs it; the first appeal creates it.
  verdictAppealCaseId?: string | null
  // Whether a confirmed decision also files or withdraws a verdict appeal.
  // False leaves the decisions exactly as they were before verdict appeals.
  registersVerdictAppeal: boolean
  onClose: () => void
  // The defendants whose prosecution appeal stands, and so have one to
  // withdraw. An APPEAL decision alone does not mean there is one.
  defendantIdsWithStandingAppeal: string[]
  // Called with each appeal that was filed, so the page knows about it without
  // refetching: a withdrawal later in the same visit needs both the appeal case
  // to withdraw from and the knowledge that this defendant has an appeal.
  onAppealFiled: (defendantId: string, appealCaseId: string) => void
  // Called with the defendants whose decision was saved, whether or not every
  // save succeeded, so the page can stop counting them as changed and a retry
  // sends only what failed.
  onSaved: (savedDefendantIds: string[]) => void
  // Called once every changed decision has been saved.
  onConfirmed: () => void
}

/**
 * Confirms the reviewer's decisions for the whole case and saves the ones that
 * changed. One modal for the page, whatever the number of defendants: the
 * decisions are confirmed together, and the page - not each defendant's radio
 * pair - knows which of them changed.
 *
 * For the public prosecution the decision is the appeal, so confirming it also
 * files a verdict appeal for every defendant it was made for, and withdraws the
 * one of every defendant it was taken back from.
 */
export const ReviewDecisionModal: FC<Props> = (props) => {
  const {
    caseId,
    changedDefendants,
    originalDecisions,
    isFine,
    indictmentAppealDeadline,
    verdictAppealCaseId,
    defendantIdsWithStandingAppeal,
    registersVerdictAppeal,
    onClose,
    onAppealFiled,
    onSaved,
    onConfirmed,
  } = props
  const { formatMessage: fm } = useIntl()
  const { updateDefendant, isUpdatingDefendant } = useDefendants()
  const {
    createProsecutionVerdictAppeal,
    transitionAppealCase,
    isCreatingAppealCase,
    isTransitioningAppealCase,
  } = useAppealCase()

  const isLate = isLateVerdictAppeal(
    changedDefendants,
    indictmentAppealDeadline,
  )

  // The appeals that a saved decision called for but whose request failed.
  // Confirming again retries exactly those: the decisions themselves are
  // already on the server, and sending one a second time would record a second
  // review. They are kept as the actions they are rather than re-derived, since
  // once a decision is saved the page no longer sees it as changed.
  const [unfiledAppeals, setUnfiledAppeals] = useState<VerdictAppealActions>({
    toAppeal: [],
    toWithdraw: [],
  })

  // Files the appeals these actions call for, and answers with the ones that
  // did not go through. The first appeal creates the verdict appeal case and
  // the rest join it, so they go one at a time rather than in parallel.
  const fileVerdictAppeals = async ({
    toAppeal,
    toWithdraw,
  }: VerdictAppealActions): Promise<VerdictAppealActions> => {
    const failed: VerdictAppealActions = { toAppeal: [], toWithdraw: [] }
    // The first appeal creates the appeal case and the rest join it, so the id
    // has to be picked up here: the page's copy of the case is not refetched
    // between the two.
    let appealCaseId = verdictAppealCaseId

    for (const defendant of toAppeal) {
      const appealCase = await createProsecutionVerdictAppeal(
        caseId,
        defendant.id,
      )

      if (!appealCase) {
        failed.toAppeal.push(defendant)
      } else {
        appealCaseId = appealCaseId ?? appealCase.id
        onAppealFiled(defendant.id, appealCase.id)
      }
    }

    // Nothing reaches toWithdraw without a standing appeal, so there is an
    // appeal case by now unless the appeal that made it has just failed.
    if (!appealCaseId) {
      failed.toWithdraw.push(...toWithdraw)
      return failed
    }

    for (const defendant of toWithdraw) {
      const withdrawn = await transitionAppealCase(
        caseId,
        appealCaseId,
        AppealCaseTransition.WITHDRAW_APPEAL,
        undefined,
        defendant.id,
      )

      if (!withdrawn) {
        failed.toWithdraw.push(defendant)
      }
    }

    return failed
  }

  // The requests are independent, not one transaction: some may succeed while
  // another fails. What succeeded is remembered so it is not sent again; the
  // modal stays open for the rest.
  const handleConfirm = async () => {
    const results = await Promise.all(
      changedDefendants.map(async (defendant) => ({
        defendant,
        saved: Boolean(
          await updateDefendant({
            caseId,
            defendantId: defendant.id,
            indictmentReviewDecision: defendant.indictmentReviewDecision,
          }),
        ),
      })),
    )

    const savedDefendants = results
      .filter(({ saved }) => saved)
      .map(({ defendant }) => defendant)

    if (savedDefendants.length > 0) {
      onSaved(savedDefendants.map((defendant) => defendant.id))
    }

    let unfiled: VerdictAppealActions = { toAppeal: [], toWithdraw: [] }

    if (registersVerdictAppeal) {
      const { toAppeal, toWithdraw } = getVerdictAppealActions(
        savedDefendants,
        originalDecisions,
        defendantIdsWithStandingAppeal,
      )

      unfiled = await fileVerdictAppeals({
        toAppeal: [...unfiledAppeals.toAppeal, ...toAppeal],
        toWithdraw: [...unfiledAppeals.toWithdraw, ...toWithdraw],
      })
      setUnfiledAppeals(unfiled)
    }

    if (
      savedDefendants.length < changedDefendants.length ||
      unfiled.toAppeal.length > 0 ||
      unfiled.toWithdraw.length > 0
    ) {
      return
    }

    onConfirmed()
  }

  return (
    <Modal
      title={
        isLate ? 'Áfrýjun eftir að fresti lauk' : fm(strings.reviewModalTitle)
      }
      text={
        <>
          {isLate && (
            <Text marginBottom={2}>
              {`Áfrýjunarfrestur rann út ${formatDate(
                indictmentAppealDeadline,
              )}.`}
            </Text>
          )}
          <Text marginBottom={2}>Viltu staðfesta eftirfarandi ákvörðun:</Text>
          {changedDefendants.map((defendant) => (
            <Text key={defendant.id}>
              <strong>{`${defendant.name}: `}</strong>
              {getReviewDecisionLabel(
                defendant.indictmentReviewDecision,
                isFine,
              )}
            </Text>
          ))}
        </>
      }
      buttons={[
        {
          text: 'Til baka',
          onClick: onClose,
          variant: 'ghost',
        },
        {
          text: fm(strings.reviewModalPrimaryButtonText),
          onClick: handleConfirm,
          isLoading:
            isUpdatingDefendant ||
            isCreatingAppealCase ||
            isTransitioningAppealCase,
        },
      ]}
      onClose={onClose}
    />
  )
}
