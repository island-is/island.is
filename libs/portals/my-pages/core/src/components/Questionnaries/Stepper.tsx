import React from 'react'
import {
  Box,
  Button,
  Text,
  Stack,
  Inline,
  Icon,
} from '@island.is/island-ui/core'

export interface Step {
  id: string
  title: string
  description?: string
  completed?: boolean
  disabled?: boolean
}

export interface StepperProps {
  steps: Step[]
  currentStepIndex: number
  onStepChange: (stepIndex: number) => void
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
  showProgress?: boolean
  orientation?: 'horizontal' | 'vertical'
  allowClickableSteps?: boolean
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  onStepChange,
  onNext,
  onPrevious,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  showProgress = true,
  orientation = 'horizontal',
  allowClickableSteps = false,
}) => {
  const canGoNext = currentStepIndex < steps.length - 1
  const canGoPrevious = currentStepIndex > 0
  const progress = steps.length
    ? (Math.min(currentStepIndex + 1, steps.length) / steps.length) * 100
    : 0
  const handleStepClick = (stepIndex: number) => {
    if (allowClickableSteps && !steps[stepIndex].disabled) {
      onStepChange(stepIndex)
    }
  }

  const renderStep = (step: Step, index: number) => {
    const isActive = index === currentStepIndex
    const isPast = index < currentStepIndex
    const isClickable = allowClickableSteps && !step.disabled

    return (
      <Box
        key={step.id}
        onClick={() => isClickable && handleStepClick(index)}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : -1}
        aria-current={isActive ? 'step' : undefined}
        aria-disabled={step.disabled || undefined}
        onKeyDown={(e) => {
          if (!isClickable) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleStepClick(index)
          }
        }}
        style={{
          cursor: isClickable ? 'pointer' : 'default',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          padding={2}
          borderRadius="standard"
          style={{
            backgroundColor: isActive
              ? '#f0f8ff'
              : isPast
              ? '#f0f0f0'
              : 'transparent',
            border: isActive ? '2px solid #0061ff' : '1px solid #e0e0e0',
            opacity: step.disabled ? 0.5 : 1,
          }}
        >
          {/* Step number/icon
          TODO: fix with stylesheet when stepper is refactored */}
          <Box
            marginRight={2}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor:
                isPast || step.completed
                  ? '#0061ff'
                  : isActive
                  ? '#0061ff'
                  : '#e0e0e0',
              color: isPast || step.completed || isActive ? 'white' : '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {step.completed ? (
              <Icon icon="checkmark" size="small" />
            ) : (
              index + 1
            )}
          </Box>

          {/* Step content */}
          <Box>
            <Text
              variant="small"
              fontWeight={isActive ? 'semiBold' : 'light'}
              color={isActive ? 'blue400' : isPast ? 'dark400' : 'dark300'}
            >
              {step.title}
            </Text>
            {step.description && (
              <Text variant="small" color="dark300">
                {step.description}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      {showProgress && (
        <Box marginBottom={3}>
          <Box
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#0061ff',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Text variant="small" color="dark300" marginTop={1}>
            Step {currentStepIndex + 1} of {steps.length}
          </Text>
        </Box>
      )}

      {/* Steps display */}
      {orientation === 'horizontal' ? (
        <Inline space={2}>{steps.map(renderStep)}</Inline>
      ) : (
        <Stack space={2}>{steps.map(renderStep)}</Stack>
      )}

      {/* Navigation buttons */}
      <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          icon="arrowBack"
          iconType="outline"
        >
          {previousLabel}
        </Button>

        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canGoNext}
          icon="arrowForward"
          iconType="outline"
        >
          {nextLabel}
        </Button>
      </Box>
    </Box>
  )
}
