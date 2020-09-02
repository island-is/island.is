import React, { FC, useRef, useState, useEffect } from 'react'
import {
  Section,
  getSubSectionsInSection,
} from '@island.is/application/template'
import { BulletList, Box, Typography } from '@island.is/island-ui/core'
import SectionNumber from '../SectionNumber'
import SubSectionItem from '../SubSectionItem'

import * as styles from './FormProgressSection.treat'
import { theme } from '@island.is/island-ui/theme'

const FormProgressSection: FC<{
  section: Section
  sectionIndex: number
  isActive: boolean
  isComplete: boolean
  isLastSection: boolean
  activeSubSection: number
}> = ({
  section,
  sectionIndex,
  isActive,
  isComplete,
  isLastSection,
  activeSubSection,
}) => {
  const subSections = getSubSectionsInSection(section)
  const hasSubSections = subSections.length > 0
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const isClient = typeof window === 'object'

  useEffect(() => {
    if (!isClient) return

    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight)
    }
  }, [isActive])

  useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= theme.breakpoints.md)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isClient])

  return (
    <Box ref={containerRef} marginBottom={[0, 0, 2]} className={styles.root}>
      <Box
        display="flex"
        alignItems="flexStart"
        marginBottom={1}
        style={{ whiteSpace: 'nowrap' }}
      >
        <Box paddingTop={2}>
          <SectionNumber
            lineHeight={isLastSection ? 0 : containerHeight + 16}
            currentState={
              isActive ? 'active' : isComplete ? 'previous' : 'next'
            }
            number={sectionIndex + 1}
          />
        </Box>
        <Box paddingTop={2} width="full" className={styles.sectionName}>
          <Typography variant={isActive ? 'h4' : 'p'} color="dark400">
            {section.name}
          </Typography>
        </Box>
      </Box>
      {isActive && hasSubSections && (
        <Box>
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
