import React, { FC } from 'react'
import { Section } from '@island.is/application/schema'
import FormProgressSection from './FormProgressSection'
import { Box } from '@island.is/island-ui/core'

const FormProgress: FC<{
  activeSection: number
  activeSubSection: number
  sections: Section[]
}> = ({ sections, activeSection, activeSubSection }) => {
  return (
    <Box paddingTop={5} paddingLeft={5}>
      {sections.map((section, index) => (
        <FormProgressSection
          key={`${section.name}-${index}`}
          section={section}
          isActive={index === activeSection}
          isComplete={index < activeSection}
          sectionIndex={index}
          activeSubSection={activeSubSection}
        />
      ))}
    </Box>
  )
}

export default FormProgress
