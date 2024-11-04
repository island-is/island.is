import { FC, useContext } from 'react'

import { EventType } from '../../graphql/schema'
import { FormContext } from '../FormProvider/FormProvider'
import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

export interface Props {
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
}

const InfoCardClosedIndictment: FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)

  const {
    defendants,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutorsOffice,
    mergeCase,
    court,
    prosecutor,
    judge,
    offence,
    indictmentReviewer,
    indictmentReviewDecision,
    indictmentReviewedDate,
    civilClaimants,
  } = useInfoCardItems()

  const { displayAppealExpirationInfo } = props

  const reviewedDate = workingCase.eventLogs?.find(
    (log) => log.eventType === EventType.INDICTMENT_REVIEWED,
  )?.created

  return (
    <InfoCard
      sections={[
        {
          id: 'defendants-section',
          items: [defendants(workingCase.type, displayAppealExpirationInfo)],
        },
        ...(workingCase.hasCivilClaims
          ? [{ id: 'civil-claimant-section', items: [civilClaimants] }]
          : []),
        {
          id: 'case-info-section',
          items: [
            policeCaseNumbers,
            courtCaseNumber,
            prosecutorsOffice,
            ...(workingCase.mergeCase ? [mergeCase] : []),
            court,
            prosecutor(workingCase.type),
            judge,
            offence,
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
                  ...(indictmentReviewedDate
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
