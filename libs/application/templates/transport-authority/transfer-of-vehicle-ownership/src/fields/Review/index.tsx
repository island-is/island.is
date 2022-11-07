import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicationStatus } from '../ApplicationStatus'
import { Overview } from '../Overview'
import { ReviewConclusion } from '../ReviewConclusion'
import { ReviewState } from '../../types'

export const Review: FC<FieldBaseProps> = (props) => {
  const [step, setStep] = useState<ReviewState>('states')
  const displayScreen = (displayStep: ReviewState) => {
    switch (displayStep) {
      case 'states':
        return <ApplicationStatus setStep={setStep} {...props} />
      case 'overview':
        return <Overview setStep={setStep} {...props} />
      case 'conclusion':
        return <ReviewConclusion setStep={setStep} {...props} />
      case 'addPeople':
        return <div>Add coowner and operator</div>
      case 'insurance':
        return <div>Add insurance</div>
      default:
        return <ApplicationStatus setStep={setStep} {...props} />
    }
  }
  return <Box>{displayScreen(step)}</Box>
}
