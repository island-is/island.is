import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { SectionNumber } from './SectionNumber/SectionNumber'
import * as styles from './Section.css'
import * as types from './types'
import { Hidden } from '../Hidden/Hidden'

export const HistorySection: FC<
  React.PropsWithChildren<{
    theme?: types.FormStepperThemes
    section: string
    sectionIndex: number
    isComplete?: boolean
    isLast?: boolean
    date?: string
    description?: React.ReactNode
  }>
> = ({
  theme = types.FormStepperThemes.PURPLE,
  section,
  sectionIndex,
  date,
  description,
  isComplete = false,
  isLast = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight } = useComponentSize(containerRef)
  const [containerHeight, setContainerHeight] = useState(0)
  const isClient = typeof window === 'object'

  useEffect(() => {
    if (!isClient) return

    if (containerRef.current) {
      setContainerHeight(activeHeight)
    }
  }, [isClient, activeHeight])

  return (
    <Box ref={containerRef} className={styles.container}>
      <Box
        display="flex"
        alignItems="flexStart"
        width="full"
        marginBottom={isLast ? 0 : [1, 1, 3]}
      >
        {date && (
          <Hidden below="xl">
            <Box paddingTop={2} paddingRight={2} className={styles.historyDate}>
              <Text lineHeight="lg" variant="small">
                {date}
              </Text>
            </Box>
          </Hidden>
        )}
        <Box paddingTop={2}>
          <SectionNumber
            theme={theme}
            lineHeight={containerHeight}
            currentState={isComplete ? 'previous' : 'next'}
            number={sectionIndex + 1}
            isHistory
          />
        </Box>
        <Box paddingTop={2} width="full">
          {date && (
            <Hidden above="lg">
              <Box paddingRight={2}>
                <Text lineHeight="lg" variant="small">
                  {date}
                </Text>
              </Box>
            </Hidden>
          )}
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
