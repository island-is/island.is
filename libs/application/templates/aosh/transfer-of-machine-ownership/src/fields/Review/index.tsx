import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { MachineLocation, Operator, ReviewState } from '../../shared'
import { ApplicationStatus } from '../ApplicationStatus'
import { Location } from '../Location'
import { Overview } from '../Overview'
import { ReviewOperatorRepeater } from '../ReviewOperatorRepeater'

export const Review: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application } = props
  const userInfo = useUserInfo()
  const [step, setStep] = useState<ReviewState>('states')

  const [location, setLocation] = useState<MachineLocation>(
    getValueViaPath(application.answers, 'location') as MachineLocation,
  )

  const [buyerOperator, setBuyerOperator] = useState<Operator>(
    getValueViaPath(application.answers, 'buyerOperator') as Operator,
  )
  const { getValues } = useFormContext()

  const reviewerNationalId = userInfo?.profile.nationalId || null
  const filteredBuyerOperator =
    buyerOperator?.wasRemoved !== 'true' ? buyerOperator : null

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
            buyerOperator={filteredBuyerOperator}
            {...props}
          />
        )
      case 'overview':
        return (
          <Overview
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            location={location}
            buyerOperator={filteredBuyerOperator}
            {...props}
          />
        )
      case 'addPeople':
        return (
          <ReviewOperatorRepeater
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            setBuyerOperator={setBuyerOperator}
            buyerOperator={
              (getValues('buyerOperator') as Operator) || buyerOperator
            }
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
