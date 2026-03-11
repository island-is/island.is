import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Icon } from '../IconRC/Icon'
import { Text } from '../Text/Text'
import { IconMapIcon as IconType } from '../IconRC/types'
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
  onBack?: () => void
}

export interface FlowStepperProps {
  steps: FlowStep[]
  cancelButtonLabel?: string
  backButtonLabel?: string
  onCancel?: () => void
  loading?: boolean
  onStepChange?: (stepIndex: number) => void
  activeStep?: number
}

export const FlowStepper: React.FC<FlowStepperProps> = ({
  steps,
  cancelButtonLabel,
  backButtonLabel,
  onCancel,
  loading = false,
  onStepChange,
  activeStep: controlledActiveStep,
}) => {
  const [internalActiveStep, setInternalActiveStep] = useState(0)
  const stepRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) {
        stepRefs.current.set(index, el)
      } else {
        stepRefs.current.delete(index)
      }
    },
    [],
  )

  // Use controlled or uncontrolled state
  const activeStep =
    controlledActiveStep !== undefined
      ? controlledActiveStep
      : internalActiveStep

  const currentStep = steps[activeStep]

  useEffect(() => {
    const el = stepRefs.current.get(activeStep)
    el?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeStep])

  const handleStepChange = (newStep: number) => {
    if (newStep < activeStep) {
      if (controlledActiveStep === undefined) {
        setInternalActiveStep(newStep)
      } else {
        onStepChange?.(newStep)
      }
    }
  }

  const handleContinue = async () => {
    if (currentStep?.onContinue) {
      await currentStep.onContinue()
    }
    if (activeStep < steps.length - 1) {
      if (controlledActiveStep === undefined) {
        setInternalActiveStep(activeStep + 1)
      } else {
        onStepChange?.(activeStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep?.onBack) {
      currentStep.onBack()
    }
    if (activeStep === 0) {
      onCancel?.()
    } else {
      if (controlledActiveStep === undefined) {
        setInternalActiveStep(activeStep - 1)
      } else {
        onStepChange?.(activeStep - 1)
      }
    }
  }

  return (
    <div className={styles.flowStepper}>
      {/* Progress Indicator */}
      <Box
        marginBottom={[3, 6]}
        background="overlay"
        className={styles.progressContainer}
      >
        <div
          className={styles.progress}
          style={
            {
              '--steps-min-width': `${120 * steps.length}px`,
            } as React.CSSProperties
          }
        >
          {/* Connector line (hidden on mobile) */}
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
              <div
                key={step.id}
                ref={setStepRef(index)}
                className={styles.stepItem}
              >
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
                <div className={styles.stepName}>
                  <Text
                    variant="small"
                    fontWeight={isActive ? 'semiBold' : 'regular'}
                    color={isActive || isCompleted ? 'dark400' : 'dark300'}
                  >
                    {step.name}
                  </Text>
                </div>
              </div>
            )
          })}
        </div>
      </Box>

      {/* Step Content */}
      <Box paddingX={[2, 4]}>{currentStep?.content}</Box>

      {/* Footer  */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        width="full"
        paddingY={5}
        paddingX={[2, 4]}
        columnGap={1}
      >
        <Button
          variant="ghost"
          onClick={activeStep === 0 ? onCancel : handleBack}
          disabled={loading}
          size="small"
        >
          {activeStep === 0 ? cancelButtonLabel : backButtonLabel}
        </Button>
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={currentStep?.continueButtonDisabled || loading}
          loading={loading}
          icon={currentStep?.continueButtonIcon}
          size="small"
        >
          {currentStep?.continueButtonLabel || 'Continue'}
        </Button>
      </Box>
    </div>
  )
}
