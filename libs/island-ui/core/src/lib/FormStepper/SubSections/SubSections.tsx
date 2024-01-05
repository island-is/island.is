import { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import cn from 'classnames'

import { Box } from '../../Box/Box'
import { SubSectionItem } from '../SubSectionItem/SubSectionItem'
import { useDeprecatedComponent } from '../../private/useDeprecatedComponent'
import * as types from '../types'
import * as styles from './SubSections.css'

export const SubSections: FC<
  React.PropsWithChildren<{
    isActive: boolean
    subSections: types.FormStepperChildSection[]
    activeSubSection: number
    showSubSectionIcon?: boolean
  }>
> = ({ isActive, subSections, activeSubSection, showSubSectionIcon }) => {
  useDeprecatedComponent('SubSections', 'SubSectionsV2')
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState<string | number>(
    'auto',
  )
  const isClient = typeof window === 'object'

  useEffect(() => {
    if (!isClient) {
      return
    }

    setContainerHeight((isActive && activeHeight) || 0)
  }, [activeHeight, isActive, isClient])

  return (
    <Box
      className={cn(styles.subSectionContainer, {
        [styles.subSectionContainerHidden]: !isActive,
      })}
      style={{ height: containerHeight }}
    >
      <Box
        ref={containerRef}
        className={styles.subSectionInnerContainer}
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <ul className={styles.subSectionList}>
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
              href={subSection.href}
            >
              {subSection.name}
            </SubSectionItem>
          ))}
        </ul>
      </Box>
    </Box>
  )
}
