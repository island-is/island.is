import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import cn from 'classnames'
import { useWindowSize } from 'react-use'
import { theme as islandUITheme } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { SectionNumber } from './SectionNumber/SectionNumber'
import * as styles from './Section.css'
import * as types from './types'

export const HistorySection: FC<{
  theme?: types.FormStepperThemes
  section: string
  subSections?: Array<React.ReactNode>
  sectionIndex: number
  isComplete?: boolean
  date?: string
  description?: React.ReactNode
}> = ({
  theme = types.FormStepperThemes.PURPLE,
  section,
  subSections,
  sectionIndex,
  date,
  description,
  isComplete = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight, width: activeWidth } = useComponentSize(
    containerRef,
  )
  const { width } = useWindowSize()
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const isClient = typeof window === 'object'
  const isSmallScreen = width <= islandUITheme.breakpoints.md

  useEffect(() => {
    if (!isClient) return

    if (containerRef.current) {
      setContainerHeight(activeHeight)
    }
  }, [isClient, activeHeight])

  useEffect(() => {
    if (!isClient) return

    if (containerRef.current) {
      setContainerWidth(activeWidth)
    }
  }, [isComplete, activeWidth, isClient])

  return (
    <Box
      ref={containerRef}
      className={styles.container}
      style={{
        marginLeft: isSmallScreen && isComplete ? `-${containerWidth}px` : '0',
      }}
    >
      <Box display="flex" alignItems="flexStart" marginBottom={[0, 0, 1]}>
        {date && (
          <Box paddingTop={2} paddingRight={2}>
            <Text variant="small">{date}</Text>
          </Box>
        )}
        <Box paddingTop={[0, 0, 2]}>
          <SectionNumber
            theme={theme}
            lineHeight={containerHeight}
            currentState={isComplete ? 'previous' : 'next'}
            number={sectionIndex + 1}
          />
        </Box>
        <Box
          paddingTop={[0, 0, 2]}
          paddingRight={[2, 2, 0]}
          width="full"
          className={cn(styles.name, {
            [styles.nameWithActiveSubSections]: subSections,
          })}
        >
          <Text lineHeight="lg" fontWeight="light">
            {section}
          </Text>
          {description && <Box paddingTop={2}>{description}</Box>}
        </Box>
      </Box>
    </Box>
  )
}

export default HistorySection
