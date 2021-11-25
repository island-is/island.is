import React, { ReactNode } from 'react'
import { Box, FormStepperSection, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './FormStepperMobile.css'

interface ProcessProps {
  sections: FormStepperSection[]
  activeSection: number
}

export const FormStepperMobile = ({
  sections,
  activeSection,
}: ProcessProps) => (
  <Box
    className={styles.stepContainer}
    display="flex"
    paddingX={3}
    paddingY={2}
    background="purple100"
    overflow="auto"
    position="relative"
  >
    {sections.map((section, index) => {
      const isCompleted =
        index < activeSection || activeSection > sections.length
      const isActive = index === activeSection
      return (
        <Box
          id={index.toString()}
          key={index}
          className={styles.step}
          display="flex"
          alignItems="center"
          paddingRight={4}
        >
          {isActive || isCompleted ? (
            <IconBackground>
              {isCompleted ? (
                <Icon icon="checkmark" color="white" />
              ) : (
                <Text variant="h3" color="white">
                  {activeSection + 1}
                </Text>
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
          <Text variant={isActive ? 'h5' : 'default'}>{section.name}</Text>
        </Box>
      )
    })}
  </Box>
)

interface IconBackgroundProps {
  children: ReactNode
}

const IconBackground = ({ children }: IconBackgroundProps) => (
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

export default FormStepperMobile
