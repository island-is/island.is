import React, { useEffect } from 'react'
import { Box, Icon, Typography } from '@island.is/island-ui/core'
import * as styles from './ProcessStepper.treat'

interface ProcessProps {
  steps: string[]
  currentStep: number
}

const ProcessStepper = ({ steps, currentStep }: ProcessProps) => {
  useEffect(() => {
    if (steps.length < currentStep) {
      currentStep = 1
    }
    // Scrolls current step into view unless it is the first step
    if (currentStep !== 1) {
      const step = document.getElementById(currentStep.toString())
      step.scrollIntoView({ block: 'end', inline: 'start', behavior: 'smooth' })
    }
  }, [currentStep, steps])

  return (
    <Box
      className={styles.stepContainer}
      display="flex"
      paddingX={3}
      paddingY={2}
      background="purple100"
      overflow="auto"
      position="relative"
    >
      {steps.map((step, index) => {
        // the second checks in isCompleted and isActive is because design wants the last step to be marked as completed as well
        const isCompleted =
          index + 1 < currentStep || currentStep === steps.length
        const isActive = currentStep === index + 1 && !isCompleted
        return (
          <Box
            id={(index + 1).toString()}
            key={index}
            className={styles.step}
            display="flex"
            alignItems="center"
            paddingRight={4}
          >
            {isActive || isCompleted ? (
              <IconBackground>
                {isCompleted ? (
                  <Icon type="check" color="white" width="16px" />
                ) : (
                  <Typography variant="h5" color="white">
                    {currentStep}
                  </Typography>
                )}
              </IconBackground>
            ) : (
              <Box
                className={styles.inProgressIcon}
                display="flex"
                background="purple200"
                borderRadius="circle"
                marginRight={1}
              ></Box>
            )}
            <Typography variant={isActive ? 'h5' : 'p'}>{step}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}

const IconBackground = ({ children }) => (
  <Box
    className={styles.activeIcon}
    display="flex"
    background="purple400"
    borderRadius="circle"
    justifyContent="center"
    alignItems="center"
    marginRight={1}
  >
    {children}
  </Box>
)

export default ProcessStepper
