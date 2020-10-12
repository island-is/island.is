import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { SectionNumber } from './SectionNumber/SectionNumber'
import { SubSections } from './SubSections/SubSections'
import * as types from './types'

function getSubSectionsInSection(
  section: types.FormStepperSection,
  subSection: string,
): types.FormStepperSection[] {
  return (section.children ?? []).filter((child) => child.type === subSection)
}

export const FormStepperSection: FC<{
  theme?: types.FormStepperThemes
  section: types.FormStepperSection
  subSection: string
  sectionIndex: number
  isActive: boolean
  isComplete: boolean
  isLastSection: boolean
  activeSubSection: number
  showSubSectionIcon?: boolean
}> = ({
  theme = types.FormStepperThemes.PURPLE,
  section,
  subSection,
  sectionIndex,
  isActive,
  isComplete,
  isLastSection,
  activeSubSection,
  showSubSectionIcon = false,
}) => {
  const subSections = getSubSectionsInSection(section, subSection)
  const hasSubSections = subSections.length > 0
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState(0)
  const isClient = typeof window === 'object'

  useEffect(() => {
    if (!isClient) {
      return
    }

    if (containerRef.current) {
      setContainerHeight(activeHeight)
    }
  }, [isActive, isClient, activeHeight])

  return (
    <Box>
      <Box ref={containerRef}>
        <Box display="flex" alignItems="flexStart" marginBottom={1}>
          <Box paddingTop={2}>
            <SectionNumber
              theme={theme}
              lineHeight={isLastSection ? 0 : containerHeight}
              currentState={
                isActive ? 'active' : isComplete ? 'previous' : 'next'
              }
              number={sectionIndex + 1}
            />
          </Box>

          <Box paddingTop={2} width="full">
            <Text lineHeight="lg" fontWeight={isActive ? 'semiBold' : 'light'}>
              {section.name}
            </Text>
          </Box>
        </Box>

        {hasSubSections && (
          <SubSections
            subSections={subSections}
            activeSubSection={activeSubSection}
            showSubSectionIcon={showSubSectionIcon}
            isActive={isActive}
          />
        )}
      </Box>
    </Box>
  )
}
