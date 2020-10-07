import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'

import { BulletList } from '../../../BulletList/BulletList'
import { Box } from '../../../Box/Box'
import { SubSectionItem } from '../SubSectionItem/SubSectionItem'
import * as types from '../../types'
import * as styles from './SubSections.treat'

export const SubSections: FC<{
  isActive: boolean
  subSections: types.FormStepperSection[]
  activeSubSection: number
  showSubSectionIcon?: boolean
}> = ({ isActive, subSections, activeSubSection, showSubSectionIcon }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState<string | number>(
    'auto',
  )
  const isClient = typeof window === 'object'

  useEffect(() => {
    if (!isClient) return
    setContainerHeight((isActive && activeHeight) || 0)
  }, [activeHeight, isActive, isClient])

  return (
    <Box
      className={styles.subSectionContainer}
      style={{ height: containerHeight }}
    >
      <Box
        ref={containerRef}
        className={styles.subSectionInnerContainer}
        style={{ opacity: isActive ? 1 : 0 }}
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
              {subSection.name}
            </SubSectionItem>
          ))}
        </BulletList>
      </Box>
    </Box>
  )
}
