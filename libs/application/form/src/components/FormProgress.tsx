import React, { FC } from 'react'
import { Section } from '@island.is/application/schema'
import FormProgressSection from './FormProgressSection'

// TODO this definitely needs more ui improvements
const FormProgress: FC<{
  activeSection: number
  activeSubSection: number
  sections: Section[]
}> = ({ sections, activeSection }) => {
  return (
    <div>
      {sections.map((section, index) => (
        <FormProgressSection
          key={`${section.name}-${index}`}
          section={section}
          isActive={index === activeSection}
          sectionIndex={index}
        />
      ))}
    </div>
  )
}

export default FormProgress
