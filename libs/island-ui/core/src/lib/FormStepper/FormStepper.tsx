import React, { FC, ReactNode } from 'react'

import { Box } from '../Box'
import { Text } from '../Text/Text'
import { FormStepperSection } from './FormStepperSection'
import * as types from './types'
import * as styles from './FormStepper.treat'

export const FormStepper: FC<{
  theme?: types.FormStepperThemes
  tag?: ReactNode
  formName?: string
  formIcon?: string
  /**
   * Index starts at 0 like array indexes.
   */
  activeSection?: number
  /**
   * Index starts at 0 like array indexes.
   */
  activeSubSection?: number
  sections: types.FormStepperSection[]
  /**
   * If the sub sections passed down have different types, you can define which one to pick and render
   */
  subSection?: string
  showSubSectionIcons?: boolean
}> = ({
  theme = types.FormStepperThemes.PURPLE,
  tag,
  formName,
  formIcon,
  activeSection = 0,
  activeSubSection = 0,
  sections,
  subSection = 'SUB_SECTION',
  showSubSectionIcons = false,
}) => {
  const hasHead = formIcon || formName

  return (
    <Box paddingTop={1} paddingBottom={[1, 1, 0]} width="full">
      {tag && <Box className={styles.tagContainer}>{tag}</Box>}

      {hasHead && (
        <Box display="flex" alignItems="center">
          {formIcon && <img src={formIcon} alt="application-icon" />}

          {formName && (
            <Box marginLeft={formIcon ? 1 : 0}>
              <Text variant="h4">{formName}</Text>
            </Box>
          )}
        </Box>
      )}

      <Box marginTop={hasHead ? 4 : 0}>
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
}
