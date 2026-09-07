import type { FC } from 'react'
import { useContext } from 'react'

import {
  isPrisonAdminUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

export interface Props {
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
  displaySentToPrisonAdminDate?: boolean
}

const InfoCardClosedIndictment: FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const {
    defendants,
    excludedDefendants,
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
  } = useInfoCardItems()

  const {
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate,
  } = props

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
        ...(workingCase.appealCase?.appealCaseNumber
          ? [
              {
                id: 'court-of-appeal-section',
                items: [
                  appealCaseNumber,
                  ...(appealAssistant ? [appealAssistant] : []),
                  ...(workingCase.appealCase?.appealJudge1 &&
                  workingCase.appealCase?.appealJudge2 &&
                  workingCase.appealCase?.appealJudge3
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
                items: excludedDefendants.map((defendant) =>
                  cancelledAndDismissedDefendants(defendant),
                ),
                columns: 2,
              },
            ]
          : []),
      ]}
    />
  )
}

export default InfoCardClosedIndictment
