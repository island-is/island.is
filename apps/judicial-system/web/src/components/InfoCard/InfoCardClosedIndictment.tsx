import type { FC } from 'react'
import { useContext } from 'react'

import {
  isCompletedCase,
  isDefenceUser,
  isPrisonAdminUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import useTargetAppealCaseByAppealCaseId from '@island.is/judicial-system-web/src/utils/hooks/useTargetAppealCaseByAppealCaseId'

import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

export interface Props {
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
  displaySentToPrisonAdminDate?: boolean
  // Which appeal the Court of Appeals section describes. Left out, it is the
  // one named in the query string - correct for every page built around a
  // ruling appeal. A page about a different appeal has to say so.
  appealCase?: AppealCase | null
}

const InfoCardClosedIndictment: FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  // The appeal this page is about - the same one the items below read, so the
  // section appears exactly when that appeal has a case number.
  const resolvedAppealCase = useTargetAppealCaseByAppealCaseId()
  const targetAppealCase =
    props.appealCase === undefined ? resolvedAppealCase : props.appealCase

  const {
    defendants,
    cancelledAndDismissedDefendants,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutorsOffice,
    mergeCase,
    court,
    prosecutor,
    judge,
    offenses,
    indictmentReviewer,
    indictmentReviewDecision,
    indictmentReviewedDate,
    indictmentCreated,
    civilClaimants,
    registrar,
    appealCaseNumber,
    appealAssistant,
    appealJudges,
  } = useInfoCardItems(undefined, props.appealCase)

  const {
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate,
  } = props

  const excludedDefendants =
    isDefenceUser(user) && isCompletedCase(workingCase.state)
      ? []
      : workingCase.defendants?.filter(
          (defendant) => defendant.indictmentCancelledOrDismissedState !== null,
        )

  return (
    <InfoCard
      sections={[
        {
          id: 'defendants-section',
          items: [
            defendants({
              caseType: workingCase.type,
              displayAppealExpirationInfo,
              displayVerdictViewDate,
              displaySentToPrisonAdminDate,
            }),
          ],
        },
        ...(workingCase.hasCivilClaims
          ? [{ id: 'civil-claimant-section', items: [civilClaimants] }]
          : []),
        {
          id: 'case-info-section',
          items: [
            indictmentCreated,
            policeCaseNumbers,
            courtCaseNumber,
            prosecutorsOffice,
            mergeCase,
            court,
            prosecutor(workingCase.type),
            judge,
            ...(workingCase.registrar ? [registrar] : []),
            offenses,
          ],
          columns: 2,
        },
        ...(targetAppealCase?.appealCaseNumber
          ? [
              {
                id: 'court-of-appeal-section',
                items: [
                  appealCaseNumber,
                  ...(appealAssistant ? [appealAssistant] : []),
                  ...(targetAppealCase?.appealJudge1 &&
                  targetAppealCase?.appealJudge2 &&
                  targetAppealCase?.appealJudge3
                    ? [appealJudges]
                    : []),
                ],
                columns: 2,
              },
            ]
          : []),
        ...(workingCase.indictmentReviewer?.name &&
        (isPublicProsecutionOfficeUser(user) || isPrisonAdminUser(user))
          ? [
              {
                id: 'additional-data-section',
                items: [
                  indictmentReviewer,
                  ...(workingCase.defendants?.some(
                    (d) => d.indictmentReviewDecision,
                  )
                    ? [indictmentReviewDecision]
                    : []),
                  ...(workingCase.indictmentReviewedDate
                    ? [
                        indictmentReviewedDate(
                          workingCase.indictmentReviewedDate,
                        ),
                      ]
                    : []),
                ],
                columns: 2,
              },
            ]
          : []),
        ...(isNonEmptyArray(excludedDefendants)
          ? [
              {
                id: 'cancelled-and-dismissed-defendants-section',
                items:
                  excludedDefendants.map((defendant) =>
                    cancelledAndDismissedDefendants(defendant),
                  ) || [],
                columns: 2,
              },
            ]
          : []),
      ]}
    />
  )
}

export default InfoCardClosedIndictment
