import React, { FC } from 'react'
import { Section, getSubSectionsInSection } from '@island.is/application/schema'
import {
  Badge,
  BulletList,
  Box,
  Bullet,
  Typography,
} from '@island.is/island-ui/core'

// TODO this definitely needs more ui improvements
const FormProgressSection: FC<{
  section: Section
  isCompleted: boolean
  isActive: boolean
  sectionIndex: number
  subSectionIndex?: number
}> = ({ section, sectionIndex, isCompleted, isActive, subSectionIndex }) => {
  return (
    <Box border="standard" padding={4}>
      <Box padding={1} background="blue100">
        <Badge number={sectionIndex + 1} />
      </Box>
      <Typography variant="h4" color="blue400">
        {section.name}
      </Typography>
      {isActive && (
        <BulletList space={2}>
          {getSubSectionsInSection(section).map((subSection, i) => (
            <Bullet key={`${subSection.name}-${i}`}>{subSection.name}</Bullet>
          ))}
        </BulletList>
      )}
    </Box>
  )
}

export default FormProgressSection
