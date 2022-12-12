import React, { FC, useRef, useState, useEffect } from 'react'
import useComponentSize from '@rehooks/component-size'
import cn from 'classnames'
import { useWindowSize } from 'react-use'

import { theme as islandUITheme } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { SectionNumber } from './SectionNumber/SectionNumber'
import * as styles from './FormStepperSection.css'
import * as types from './types'
import SubSections from './SubSectionsV2/SubSectionsV2'

export const FormStepperSectionV2: FC<{
  theme?: types.FormStepperThemes
  section: React.ReactNode
  subSections?: Array<React.ReactNode>
  sectionIndex: number
  isActive?: boolean
  isComplete?: boolean
  isLastSection?: boolean
}> = ({
  theme = types.FormStepperThemes.PURPLE,
  section,
  subSections,
  sectionIndex,
  isActive,
  isComplete,
  isLastSection,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: activeHeight, width: activeWidth } = useComponentSize(
    containerRef,
  )
  const { width } = useWindowSize()
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const isSmallScreen = width <= islandUITheme.breakpoints.md

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(activeHeight)
    }
  }, [isActive, activeHeight])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(activeWidth)
    }
  }, [isComplete, isActive, activeWidth])

  return (
    <Box
      ref={containerRef}
      className={styles.container}
      style={{
        marginLeft: isSmallScreen && isComplete ? `-${containerWidth}px` : '0',
      }}
    >
      <Box display="flex" alignItems="center" marginBottom={[0, 0, 1]}>
        <Box paddingTop={[0, 0, 2]}>
          <SectionNumber
            theme={theme}
            lineHeight={isLastSection ? 0 : containerHeight}
            currentState={
              isActive ? 'active' : isComplete ? 'previous' : 'next'
            }
            number={sectionIndex + 1}
          />
        </Box>

        <Box
          paddingTop={[0, 0, 2]}
          paddingRight={[2, 2, 0]}
          width="full"
          className={cn(styles.name, {
            [styles.nameWithActiveSubSections]: subSections && isActive,
          })}
        >
          <Text lineHeight="lg" fontWeight={isActive ? 'semiBold' : 'light'}>
            {section}
          </Text>
        </Box>
      </Box>
      {isSmallScreen || !subSections ? null : (
        <SubSections isActive={isActive}>{subSections}</SubSections>
      )}
    </Box>
  )
}

export default FormStepperSectionV2
