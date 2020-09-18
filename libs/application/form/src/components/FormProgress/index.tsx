import React, { FC } from 'react'
import { Section } from '@island.is/application/template'
import FormProgressSection from './FormProgressSection'
import ApplicationName from './components/ApplicationName'

import { Box } from '@island.is/island-ui/core'

import * as styles from './FormProgress.treat'
import { FormModes, ProgressThemes } from '../../types'

const FormProgress: FC<{
  theme?: ProgressThemes
  formName: string
  formIcon: string
  activeSection: number
  activeSubSection: number
  sections: Section[]
  showSubSectionIcons?: boolean
}> = ({
  theme = ProgressThemes.PURPLE,
  formName,
  formIcon,
  activeSection,
  activeSubSection,
  sections,
  showSubSectionIcons = false,
}) => {
  return (
    <Box
      paddingTop={1}
      paddingBottom={[1, 1, 0]}
      width="full"
      className={styles.root}
    >
      <ApplicationName name={formName} icon={formIcon} />
      <Box marginTop={4}>
        {sections.map((section, index) => (
          <FormProgressSection
            theme={theme}
            key={`${section.name}-${index}`}
            section={section}
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

export default FormProgress
