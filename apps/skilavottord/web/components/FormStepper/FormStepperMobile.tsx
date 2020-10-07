import React, { useEffect } from 'react'
import {
  Box,
  FormStepperSection,
  Icon,
  Typography,
} from '@island.is/island-ui/core'
import * as styles from './FormStepperMobile.treat'

interface ProcessProps {
  sections: FormStepperSection[]
  activeSection: number
}

const FormStepperMobile = ({ sections, activeSection }: ProcessProps) => {
  useEffect(() => {
    const section = document.getElementById(activeSection.toString())
    // Scrolls current step into view unless it is the first or last step
    if (activeSection !== 0 && section) {
      section.scrollIntoView({
        block: 'end',
        inline: 'start',
        behavior: 'smooth',
      })
    }
  }, [activeSection, sections])

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
                  <Icon type="check" color="white" width="16px" />
                ) : (
                  <Typography variant="h5" color="white">
                    {activeSection + 1}
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
            <Typography variant={isActive ? 'h5' : 'p'}>
              {section.name}
            </Typography>
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

export default FormStepperMobile
