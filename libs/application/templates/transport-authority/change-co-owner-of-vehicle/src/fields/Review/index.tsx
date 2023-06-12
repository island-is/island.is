import { FieldBaseProps } from '@island.is/application/types'
import { useAuth } from '@island.is/auth/react'
import { Box } from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { ReviewState } from '../../shared'
import { ApplicationStatus } from '../ApplicationStatus'
import { Overview } from '../Overview'
import { ReviewConclusion } from '../ReviewConclusion'

export const Review: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { userInfo } = useAuth()
  const [step, setStep] = useState<ReviewState>('states')

  const reviewerNationalId = userInfo?.profile.nationalId || null

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
            {...props}
          />
        )
      case 'overview':
        return (
          <Overview
            setStep={setStep}
            reviewerNationalId={reviewerNationalId}
            {...props}
          />
        )
      case 'conclusion':
        return (
          <ReviewConclusion
            setStep={setStep}
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
