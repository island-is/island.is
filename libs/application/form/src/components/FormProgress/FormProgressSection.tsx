import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import { useLocale } from '@island.is/localization'

import {
  Section,
  getSubSectionsInSection,
  SubSection,
} from '@island.is/application/template'
import { BulletList, Box, Typography } from '@island.is/island-ui/core'
import SectionNumber from './components/SectionNumber'
import SubSectionItem from './components/SubSectionItem'

import * as styles from './FormProgressSection.treat'

const SubSections: FC<{
  isActive: boolean
  subSections: SubSection[]
  activeSubSection: number
  showSubSectionIcon?: boolean
}> = ({ isActive, subSections, activeSubSection, showSubSectionIcon }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState<string | number>(
    'auto',
  )
  const isClient = typeof window === 'object'
  const { formatMessage } = useLocale()

  useEffect(() => {
    if (!isClient) return
    setContainerHeight((isActive && activeHeight) || 0)
  }, [activeHeight, isActive, isClient])

  return (
    <Box
      className={styles.subSectionContainer}
      style={{
        height: containerHeight,
      }}
    >
      <Box
        ref={containerRef}
        className={styles.subSectionInnerContainer}
        style={{
          opacity: isActive ? 1 : 0,
        }}
      >
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
              showIcon={showSubSectionIcon}
            >
              {formatMessage(subSection.name)}
            </SubSectionItem>
          ))}
        </BulletList>
      </Box>
    </Box>
  )
}

const FormProgressSection: FC<{
  section: Section
  sectionIndex: number
  isActive: boolean
  isComplete: boolean
  isLastSection: boolean
  activeSubSection: number
  showSubSectionIcon?: boolean
}> = ({
  section,
  sectionIndex,
  isActive,
  isComplete,
  isLastSection,
  activeSubSection,
  showSubSectionIcon = false,
}) => {
  const subSections = getSubSectionsInSection(section)
  const hasSubSections = subSections.length > 0
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState(0)
  const isClient = typeof window === 'object'
  const { formatMessage } = useLocale()

  useEffect(() => {
    if (!isClient) return

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
              lineHeight={isLastSection ? 0 : containerHeight}
              currentState={
                isActive ? 'active' : isComplete ? 'previous' : 'next'
              }
              number={sectionIndex + 1}
            />
          </Box>
          <Box paddingTop={2} width="full">
            <Typography
              variant={
                isActive ? 'formProgressSectionActive' : 'formProgressSection'
              }
            >
              {formatMessage(section.name)}
            </Typography>
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

export default FormProgressSection
