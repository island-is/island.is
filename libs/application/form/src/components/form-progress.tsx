import React, { FC } from 'react'
import { Section } from '@island.is/application/schema'
import FormProgressSection from './form-progress-section'

// TODO this definitely needs more ui improvements
const FormProgress: FC<{
  activeSection: number
  activeSubSection: number
  sections: Section[]
}> = ({ sections, activeSection, activeSubSection }) => {
  return (
    <div>
      {sections.map((section, index) => (
        <FormProgressSection
          key={`${section.name}-${index}`}
          section={section}
          isCompleted={activeSection > index}
          isActive={index === activeSection}
          sectionIndex={index}
          subSectionIndex={index === activeSubSection ? activeSubSection : -1}
        />
      ))}
    </div>
  )
}

export default FormProgress
