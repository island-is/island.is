import React, { Children, FC, useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import cx from 'classnames'

import { Box, BoxProps, GridContainer } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { ScrollIndicator, ScrollIndicatorColors } from './ScrollIndicator'
import * as styles from './GridItems.css'

export type { ScrollIndicatorColors } from './ScrollIndicator'

type GridItemsProps = {
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
  paddingTop?: BoxProps['paddingTop']
  paddingBottom?: BoxProps['paddingBottom']
  insideGridContainer?: boolean
  mobileItemWidth?: number
  mobileItemsRows?: number
  half?: boolean
  quarter?: boolean
  third?: boolean
  indicator?: ScrollIndicatorColors
}

export const GridItems: FC<React.PropsWithChildren<GridItemsProps>> = ({
  marginTop = 0,
  marginBottom = 0,
  paddingTop = 0,
  paddingBottom = 0,
  insideGridContainer = false,
  mobileItemWidth = 400,
  mobileItemsRows = 3,
  half = false,
  quarter = false,
  third = false,
  indicator,
  children,
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const items = Children.toArray(children)

  useEffect(() => {
    if (quarter) {
      setIsMobile(width < theme.breakpoints.xl)
    } else {
      setIsMobile(width < theme.breakpoints.sm)
    }
  }, [quarter, width])

  let style = null

  const count = items.length
  const perRow = Math.ceil(count / mobileItemsRows)

  if (isMobile) {
    style = {
      width: mobileItemWidth * perRow,
      gridTemplateColumns: `repeat(${perRow}, minmax(${mobileItemWidth}px, 1fr))`,
      minHeight: 0,
      minWidth: 0,
    }
  }

  return (
    <Wrapper show={insideGridContainer}>
      <>
        <Box
          marginTop={marginTop}
          marginBottom={marginBottom}
          ref={scrollRef}
          className={cx(styles.container, {
            [styles.hideScrollbar]: !!indicator,
          })}
        >
          <Box
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            className={cx(styles.wrapper, {
              [styles.half]: half,
              [styles.quarter]: quarter,
              [styles.third]: third,
            })}
            {...(style && { style })}
          >
            {children}
          </Box>
        </Box>
        {indicator && isMobile && (
          <ScrollIndicator scrollRef={scrollRef} colors={indicator} />
        )}
      </>
    </Wrapper>
  )
}

type WrapperProps = {
  show: boolean
  children: React.ReactNode
}

const Wrapper: FC<React.PropsWithChildren<WrapperProps>> = ({
  show = false,
  children,
}) =>
  show ? (
    <GridContainer className={styles.gridContainer}>{children}</GridContainer>
  ) : (
    <>{children}</>
  )

export default GridItems
