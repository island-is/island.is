import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import cn from 'classnames'

import { Box } from '../../Box/Box'
import * as styles from './SubSectionsV2.css'
import { useDeprecatedComponent } from '../../private/useDeprecatedComponent'
import { SectionNumberColumn } from '../SectionNumberColumn/SectionNumberColumn'

export const SubSections: FC<{
  isActive?: boolean
  subSections?: React.ReactNodeArray
}> = ({ isActive = false, subSections }) => {
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
          {subSections?.map((subSection, i) => (
            <Box
              display="flex"
              alignItems="center"
              marginTop={[0, 0, 1]}
              component="li"
              key={`subSection-${i}`}
            >
              <SectionNumberColumn type="subSection" />
              {subSection}
            </Box>
          ))}
        </ul>
      </Box>
    </Box>
  )
}

export default SubSections
