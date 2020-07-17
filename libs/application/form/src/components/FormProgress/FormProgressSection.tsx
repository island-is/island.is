import React, { FC } from 'react'
import { Section, getSubSectionsInSection } from '@island.is/application/schema'
import { BulletList, Box, Bullet, Typography } from '@island.is/island-ui/core'
import SectionNumber from '../SectionNumber'
import SubSectionItem from '../SubSectionItem'
import { has } from 'lodash'

const FormProgressSection: FC<{
  section: Section
  sectionIndex: number
  isActive: boolean
  isComplete: boolean
  activeSubSection: number
}> = ({ section, sectionIndex, isActive, isComplete, activeSubSection }) => {
  const subSections = getSubSectionsInSection(section)
  const hasSubSections = subSections.length > 0

  return (
    <Box marginBottom={2}>
      <Box display="flex" alignItems="flexStart" marginBottom={1}>
        <Box padding={1} background="blue100" marginRight={3}>
          <SectionNumber
            currentState={
              isActive ? 'active' : isComplete ? 'previous' : 'next'
            }
            number={sectionIndex + 1}
          />
        </Box>
        <Typography
          variant="h4"
          color={isActive || isComplete ? 'blue400' : 'dark200'}
        >
          {section.name}
        </Typography>
      </Box>
      {isActive && hasSubSections && (
        <Box paddingLeft={1}>
          <BulletList>
            {subSections.map((subSection, i) => (
              <SubSectionItem
                key={`${subSection.name}-${i}`}
                currentState={
                  i === activeSubSection
                    ? 'active'
                    : i < activeSubSection
                    ? 'previous'
                    : 'next'
                }
              >
                {subSection.name}
              </SubSectionItem>
            ))}
          </BulletList>
        </Box>
      )}
    </Box>
  )
}

export default FormProgressSection
