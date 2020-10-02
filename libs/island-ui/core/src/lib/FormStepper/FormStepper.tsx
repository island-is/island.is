import React, { FC } from 'react'

import { Box } from '../Box'
import { Typography } from '../Typography/Typography'
import { FormStepperSection } from './FormStepperSection'
import * as types from './types'
import * as styles from './FormStepper.treat'

export const FormStepper: FC<{
  theme?: types.FormStepperThemes
  tag?: React.ReactNode
  formName: string
  formIcon?: string
  activeSection: number
  activeSubSection: number
  sections: types.FormStepperSection[]
  subSection?: string
  showSubSectionIcons?: boolean
}> = ({
  theme = types.FormStepperThemes.PURPLE,
  tag,
  formName,
  formIcon,
  activeSection,
  activeSubSection,
  sections,
  subSection = 'SUB_SECTION',
  showSubSectionIcons = false,
}) => (
  <Box paddingTop={1} paddingBottom={[1, 1, 0]} width="full">
    {tag && <Box className={styles.tagContainer}>{tag}</Box>}

    <Box display="flex" alignItems="center">
      {formIcon && <img src={formIcon} alt="application-icon" />}

      <Box marginLeft={formIcon ? 1 : 0}>
        <Typography variant="h4">{formName}</Typography>
      </Box>
    </Box>

    <Box marginTop={4}>
      {sections.map((section, index) => (
        <FormStepperSection
          theme={theme}
          key={`${section.name}-${index}`}
          section={section}
          subSection={subSection}
          isActive={index === activeSection}
          isComplete={index < activeSection}
          isLastSection={index === sections.length - 1}
          sectionIndex={index}
          activeSubSection={activeSubSection}
          showSubSectionIcon={showSubSectionIcons}
        />
      ))}
    </Box>
  </Box>
)
