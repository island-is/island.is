import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicationStatus } from '../ApplicationStatus'
import { Overview } from '../Overview'
import { ReviewConclusion } from '../ReviewConclusion'

export const Review: FC<FieldBaseProps> = (props) => {
  const [step, setStep] = useState<string>('states')
  const displayScreen = (displayStep: string) => {
    switch (displayStep) {
      case 'states':
        return <ApplicationStatus setStep={setStep} {...props} />
      case 'overview':
        return <Overview setStep={setStep} {...props} />
      case 'conclusion':
        return <ReviewConclusion setStep={setStep} {...props} />
      case 'addPeople':
        return null
      case 'insurance':
        return null
      default:
        return null
    }
  }
  return <Box>{displayScreen(step)}</Box>
}
