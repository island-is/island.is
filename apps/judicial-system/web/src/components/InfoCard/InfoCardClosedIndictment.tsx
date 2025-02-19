import { FC, useContext } from 'react'

import { EventType } from '../../graphql/schema'
import { FormContext } from '../FormProvider/FormProvider'
import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

export interface Props {
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
  displaySentToPrisonAdminDate?: boolean
}

const InfoCardClosedIndictment: FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)

  const {
    showItem,
    defendants,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutorsOffice,
    mergeCase,
    court,
    prosecutor,
    judge,
    offense,
    indictmentReviewer,
    indictmentReviewDecision,
    indictmentReviewedDate,
    indictmentCreated,
    civilClaimants,
  } = useInfoCardItems()

  const {
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate,
  } = props

  const reviewedDate = workingCase.eventLogs?.find(
    (log) => log.eventType === EventType.INDICTMENT_REVIEWED,
  )?.created

  return (
    <InfoCard
      sections={[
        {
          id: 'defendants-section',
          items: [
            defendants(
              workingCase.type,
              displayAppealExpirationInfo,
              displayVerdictViewDate,
              displaySentToPrisonAdminDate,
            ),
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
            offense,
          ],
          columns: 2,
        },
        ...(workingCase.indictmentReviewer?.name
          ? [
              {
                id: 'additional-data-section',
                items: [
                  indictmentReviewer,
                  ...(workingCase.indictmentReviewDecision
                    ? [indictmentReviewDecision]
                    : []),
                  ...(reviewedDate
                    ? [indictmentReviewedDate(reviewedDate)]
                    : []),
                ],
                columns: 2,
              },
            ]
          : []),
      ]}
    />
  )
}

export default InfoCardClosedIndictment
