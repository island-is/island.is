import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicationStatus } from '../ApplicationStatus'
import { Overview } from '../Overview'
import { ReviewConclusion } from '../ReviewConclusion'
import { Location } from '../Location'
import { ReviewCoOwnerAndOperatorRepeater } from '../ReviewCoOwnerAndOperatorRepeater'
import { CoOwnerAndOperator, MachineLocation, ReviewState } from '../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { useAuth } from '@island.is/auth/react'
import { ReviewMainOperator } from '../ReviewMainOperator'

export const Review: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application } = props
  const { userInfo } = useAuth()
  const [step, setStep] = useState<ReviewState>('states')

  const [location, setLocation] = useState<MachineLocation>(
    getValueViaPath(application.answers, 'location') as MachineLocation,
  )

  const [coOwnersAndOperators, setCoOwnersAndOperators] = useState<
    CoOwnerAndOperator[]
  >(
    getValueViaPath(
      application.answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[],
  )
  const [mainOperator, setMainOperator] = useState<string>(
    getValueViaPath(
      application.answers,
      'buyerMainOperator.nationalId',
      '',
    ) as string,
  )
  const reviewerNationalId = userInfo?.profile.nationalId || null

  const filteredCoOwnersAndOperators = coOwnersAndOperators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

  const displayScreen = (
    displayStep: ReviewState,
    reviewerNationalId: string,
  ) => {
    switch (displayStep) {
      case 'states':
        return (
          <ApplicationStatus
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            coOwnersAndOperators={filteredCoOwnersAndOperators}
            {...props}
          />
        )
      case 'overview':
        return (
          <Overview
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            location={location}
            coOwnersAndOperators={filteredCoOwnersAndOperators}
            mainOperator={mainOperator}
            {...props}
          />
        )
      case 'conclusion':
        return (
          <ReviewConclusion
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            coOwnersAndOperators={filteredCoOwnersAndOperators}
            {...props}
          />
        )
      case 'addPeople':
        return (
          <ReviewCoOwnerAndOperatorRepeater
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            setCoOwnersAndOperators={setCoOwnersAndOperators}
            coOwnersAndOperators={coOwnersAndOperators}
            {...props}
          />
        )
      case 'mainOperator':
        return (
          <ReviewMainOperator
            setStep={setStep}
            coOwnersAndOperators={coOwnersAndOperators}
            setMainOperator={setMainOperator}
            mainOperator={mainOperator}
            {...props}
          />
        )
      case 'location':
        return (
          <Location
            setStep={setStep}
            setLocation={setLocation}
            reviewerNationalId={reviewerNationalId}
            {...props}
          />
        )
      default:
        return (
          <ApplicationStatus
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            {...props}
          />
        )
    }
  }

  if (!reviewerNationalId) return null

  return <Box>{displayScreen(step, reviewerNationalId)}</Box>
}
