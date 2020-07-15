import React, { FC } from 'react'
import { Section, getSubSectionsInSection } from '@island.is/application/schema'
import { BulletList, Box, Bullet, Typography } from '@island.is/island-ui/core'
import SectionNumber from '../SectionNumber'
import SubSectionItem from '../SubSectionItem'

const FormProgressSection: FC<{
  section: Section
  isActive: boolean
  isComplete: boolean
  sectionIndex: number
  activeSubSection: number
}> = ({ section, sectionIndex, isActive, isComplete, activeSubSection }) => {
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
      {isActive && getSubSectionsInSection(section).length > 0 && (
        <Box paddingLeft={1}>
          <BulletList>
            {getSubSectionsInSection(section).map((subSection, i) => (
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
