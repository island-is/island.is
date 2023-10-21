import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import cn from 'classnames'

import { Box } from '../../Box/Box'
import { SectionNumberColumn } from '../SectionNumberColumn/SectionNumberColumn'
import * as styles from './SubSectionsV2.css'

export const SubSections: FC<
  React.PropsWithChildren<{
    isActive?: boolean
    subSections?: React.ReactNodeArray
  }>
> = ({ isActive = false, subSections }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState<string | number>(
    'auto',
  )

  useEffect(() => {
    setContainerHeight((isActive && activeHeight) || 0)
  }, [activeHeight, isActive])

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
