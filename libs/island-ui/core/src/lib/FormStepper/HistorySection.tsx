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
    subjectAndActor?: string
    sectionIndex: number
    isComplete?: boolean
    isLast?: boolean
    date?: string
    description?: React.ReactNode
    customSection?: React.ReactNode
    forceRightAlignedDate?: boolean
  }>
> = ({
  theme = types.FormStepperThemes.PURPLE,
  section,
  subjectAndActor,
  sectionIndex,
  date,
  description,
  isComplete = false,
  isLast = false,
  customSection,
  forceRightAlignedDate = false,
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
        {date && !forceRightAlignedDate && (
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
            <Hidden above={forceRightAlignedDate ? undefined : 'lg'}>
              <Box paddingRight={2}>
                <Text lineHeight="lg" variant="small">
                  {date}
                </Text>
              </Box>
            </Hidden>
          )}
          {customSection ? (
            customSection
          ) : (
            <Box display="flex" flexDirection="column">
              <Text lineHeight="lg" fontWeight="light">
                {section}
              </Text>
              <Text lineHeight="lg" variant="eyebrow" fontWeight="light">
                {subjectAndActor}
              </Text>
            </Box>
          )}
          {description && <Box paddingTop={2}>{description}</Box>}
        </Box>
      </Box>
    </Box>
  )
}

export default HistorySection
