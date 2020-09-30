import React, { useEffect } from 'react'
import { Box, Icon, Typography } from '@island.is/island-ui/core'
import * as styles from './ApplicationProgress.treat'

const ApplicationProgress = ({
  steps = ['Confirm car for recycling', 'Recycle the car', 'Get money back'],
  currentStep = 1,
}) => {
  if (steps.length < currentStep) {
    currentStep = 1
  }

  useEffect(() => {
    if (currentStep !== 1) {
      const step = document.getElementById(currentStep.toString())
      step.scrollIntoView({ block: 'end', inline: 'start', behavior: 'smooth' })
    }
  }, [])

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
              <Circle>
                {isCompleted ? (
                  <Icon type="check" color="white" width="16px" />
                ) : (
                  <Typography variant="h5" color="white">
                    {currentStep}
                  </Typography>
                )}
              </Circle>
            ) : (
              <Box
                className={styles.notStarted}
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

const Circle = ({ children }) => (
  <Box
    className={styles.activeNumberContainer}
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

export default ApplicationProgress
