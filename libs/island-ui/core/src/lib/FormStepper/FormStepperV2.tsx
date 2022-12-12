import React, { FC, ReactElement } from 'react'

import { Box } from '../Box/Box'
import Section from './Section'
import * as types from './types'
import * as styles from './FormStepper.css'

export const FormStepperV2: FC<{
  theme?: types.FormStepperThemes
  sections?: ReactElement[]
}> = ({ sections, theme }) => {
  return (
    <Box width="full">
      {sections ? (
        <Box className={styles.list}>
          {sections.map((section, index) => (
            <Section
              theme={theme}
              key={`section-${index}`}
              sectionIndex={index}
              isLastSection={index === sections.length - 1}
              {...section.props}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  )
}

export default FormStepperV2
