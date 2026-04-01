import { FC, useContext } from 'react'

import {
  isDefenceUser,
  isPrisonAdminUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'

import { isNonEmptyArray } from '../../utils/arrayHelpers'
import { areAllDefendantsCancelledOrDismissed } from '../../utils/utils'
import { FormContext } from '../FormProvider/FormProvider'
import { UserContext } from '../UserProvider/UserProvider'
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
    showItem,
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
  } = useInfoCardItems()

  const {
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate,
  } = props

  const excludedDefendants =
    isDefenceUser(user) &&
    areAllDefendantsCancelledOrDismissed(workingCase.defendants)
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
            ...(showItem(mergeCase) ? [mergeCase] : []),
            court,
            prosecutor(workingCase.type),
            judge,
            ...(workingCase.registrar ? [registrar] : []),
            offenses,
          ],
          columns: 2,
        },
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
