import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicationStatus } from '../ApplicationStatus'
import { Overview } from '../Overview'
import { ReviewConclusion } from '../ReviewConclusion'
import { Insurance } from '../Insurance'
import { ReviewState } from '../../types'
import { getValueViaPath } from '@island.is/application/core'

export const Review: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const [step, setStep] = useState<ReviewState>('states')
  const [insurance, setInsurance] = useState<string | undefined>(
    getValueViaPath(application.answers, 'insurance.name', undefined),
  )
  const displayScreen = (displayStep: ReviewState) => {
    switch (displayStep) {
      case 'states':
        return <ApplicationStatus setStep={setStep} {...props} />
      case 'overview':
        return <Overview setStep={setStep} insurance={insurance} {...props} />
      case 'conclusion':
        return <ReviewConclusion setStep={setStep} {...props} />
      case 'addPeople':
        return <div>Add coowner and operator</div>
      case 'insurance':
        return (
          <Insurance setStep={setStep} setInsurance={setInsurance} {...props} />
        )
      default:
        return <ApplicationStatus setStep={setStep} {...props} />
    }
  }
  return <Box>{displayScreen(step)}</Box>
}
