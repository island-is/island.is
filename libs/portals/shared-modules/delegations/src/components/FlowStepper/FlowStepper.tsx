import React, { ReactNode, useState } from 'react'
import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { IconMapIcon as IconType } from '@island.is/island-ui/core'
import * as styles from './FlowStepper.css'
import cn from 'classnames'

export interface FlowStep {
  id: string
  name: string
  content: ReactNode
  continueButtonLabel?: string
  continueButtonIcon?: IconType
  onContinue?: () => void | Promise<void>
  continueButtonDisabled?: boolean
}

export interface FlowStepperProps {
  steps: FlowStep[]
  cancelButtonLabel?: string
  onCancel?: () => void
  loading?: boolean
  onStepChange?: (stepIndex: number) => void
  activeStep?: number
}

export const FlowStepper: React.FC<FlowStepperProps> = ({
  steps,
  cancelButtonLabel,
  onCancel,
  loading = false,
  onStepChange,
  activeStep: controlledActiveStep,
}) => {
  const [internalActiveStep, setInternalActiveStep] = useState(0)

  // Use controlled or uncontrolled state
  const activeStep =
    controlledActiveStep !== undefined
      ? controlledActiveStep
      : internalActiveStep

  const currentStep = steps[activeStep]

  const handleStepChange = (newStep: number) => {
    if (newStep < activeStep) {
      if (controlledActiveStep === undefined) {
        setInternalActiveStep(newStep)
      }
      onStepChange?.(newStep)
    }
  }

  const handleContinue = async () => {
    if (currentStep?.onContinue) {
      await currentStep.onContinue()
    }
    if (activeStep < steps.length - 1) {
      if (controlledActiveStep === undefined) {
        setInternalActiveStep(activeStep + 1)
      }
      onStepChange?.(activeStep + 1)
    }
  }

  return (
    <div className={styles.flowStepper}>
      {/* Progress Indicator */}
      <Box
        marginBottom={6}
        background="overlay"
        paddingTop={3}
        paddingBottom={2}
        paddingX={4}
        className={styles.progressContainer}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="spaceAround"
          className={styles.progress}
        >
          {/* Connector line */}
          <div
            className={styles.backgroundLine}
            style={
              {
                '--progress': `${
                  steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0
                }%`,
                '--line-inset': `calc(100% / ${2 * steps.length})`,
              } as React.CSSProperties
            }
          />

          {steps.map((step, index) => {
            const isActive = index === activeStep
            const isCompleted = index < activeStep

            return (
              <Box
                key={step.id}
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="relative"
                rowGap={1}
              >
                {/* Step Number Circle */}
                <button
                  type="button"
                  onClick={() => handleStepChange(index)}
                  className={cn(styles.stepCircle, {
                    [styles.stepCircleActive]: isActive,
                    [styles.stepCircleCompleted]: isCompleted,
                    [styles.stepCircleInactive]: !isActive && !isCompleted,
                  })}
                >
                  {isCompleted ? (
                    <Icon icon="checkmark" color="white" size="medium" />
                  ) : (
                    <Text variant="medium" fontWeight="semiBold" color="white">
                      {index + 1}
                    </Text>
                  )}
                </button>
                {/* Step Name */}
                <Box className={styles.stepName}>
                  <Text
                    variant="small"
                    fontWeight={isActive ? 'semiBold' : 'regular'}
                    color={isActive || isCompleted ? 'dark400' : 'dark300'}
                  >
                    {step.name}
                  </Text>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Step Content */}
      <Box paddingX={4}>{currentStep?.content}</Box>

      {/* Footer  */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        width="full"
        paddingY={5}
        paddingX={4}
      >
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          {cancelButtonLabel}
        </Button>
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={currentStep?.continueButtonDisabled || loading}
          loading={loading}
          icon={currentStep?.continueButtonIcon}
        >
          {currentStep?.continueButtonLabel || 'Continue'}
        </Button>
      </Box>
    </div>
  )
}
