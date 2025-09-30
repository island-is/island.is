import {
  Box,
  Button,
  FormStepperThemes,
  FormStepperV2,
  Section,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from '../../lib/messages'
import capitalize from 'lodash/capitalize'

export interface Step {
  id: string
  title: string
  description?: string
  completed?: boolean
  disabled?: boolean
}

export interface StepperProps {
  steps: Step[] | undefined
  currentStepIndex: number
  onStepChange: (stepIndex: number) => void
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
  allowClickableSteps?: boolean
  backLink?: string
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  onStepChange,
  onNext,
  onPrevious,
  backLink,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  allowClickableSteps = false,
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const canGoNext = currentStepIndex < (steps?.length || 1) - 1
  const canGoPrevious = currentStepIndex > 0
  const progress = steps?.length
    ? (Math.min(currentStepIndex + 1, steps.length) / steps.length) * 100
    : 0
  const handleStepClick = (stepIndex: number) => {
    if (allowClickableSteps && steps && !steps[stepIndex].disabled) {
      onStepChange(stepIndex)
    }
  }
  return (
    <Box>
      <Box marginBottom={8}>
        <Button
          variant="ghost"
          onClick={() =>
            backLink ? navigate({ pathname: backLink }) : navigate(-1)
          }
          size="small"
          preTextIcon="arrowBack"
          preTextIconType="outline"
        >
          {formatMessage(m.goBack)}
        </Button>
      </Box>
      {steps && steps.length > 1 && (
        <FormStepperV2
          sections={steps?.map((step, index) => {
            const isActive = index === currentStepIndex
            const isPast = index < currentStepIndex
            const isClickable = allowClickableSteps && !step.disabled

            return (
              <Section
                key={step.id}
                section={capitalize(step.title)}
                sectionIndex={index}
                isActive={isActive}
                theme={FormStepperThemes.BLUE}
                isComplete={step.completed || isPast}
              />
            )
          })}
        />
      )}
    </Box>
  )
}
