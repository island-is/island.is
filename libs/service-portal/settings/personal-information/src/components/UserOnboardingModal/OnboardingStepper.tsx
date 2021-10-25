import { Box, Inline } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { m } from '@island.is/service-portal/core'
import { OnboardingStep } from './UserOnboardingModal'
import * as styles from './UserOnboardingModal.css'
import cn from 'classnames'

interface Props {
  activeStep: OnboardingStep
}

const steps: {
  label: MessageDescriptor
  steps: OnboardingStep[]
}[] = [
  {
    label: m.language,
    steps: ['language-form'],
  },
  {
    label: m.telNumber,
    steps: ['tel-form'],
  },
  {
    label: m.email,
    steps: ['email-form', 'submit-form'],
  },
  {
    label: m.confirmation,
    steps: ['form-submitted'],
  },
]

export const OnboardingStepper: FC<Props> = ({ activeStep }) => {
  return (
    <Box
      display="flex"
      justifyContent={['center', 'flexStart']}
      marginBottom={[3, 5]}
    >
      <Inline space={2}>
        {steps.map((step, index) => (
          <Box
            key={index}
            className={cn(styles.stepDot, {
              [styles.stepDotActive]: step.steps.includes(activeStep),
            })}
            background={
              step.steps.includes(activeStep) ? 'purple400' : 'purple200'
            }
          />
        ))}
      </Inline>
    </Box>
  )
}
