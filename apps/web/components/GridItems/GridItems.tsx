import React, { Children, FC, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import cx from 'classnames'

import { Box, BoxProps, GridContainer } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './GridItems.css'

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
  showGradients?: boolean
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
  showGradients = false,
  children,
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(false)
  const [leftGradientWidth, setLeftGradientWidth] = useState(80)
  const [rightGradientWidth, setRightGradientWidth] = useState(80)
  const [leftGradientOpacity, setLeftGradientOpacity] = useState(0)
  const [rightGradientOpacity, setRightGradientOpacity] = useState(1)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const items = Children.toArray(children)

  useEffect(() => {
    if (quarter) {
      setIsMobile(width < theme.breakpoints.xl)
    } else {
      setIsMobile(width < theme.breakpoints.sm)
    }
  }, [quarter, width])

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth

    // Show/hide gradients
    setShowLeftGradient(scrollLeft > 10)
    setShowRightGradient(scrollLeft < maxScroll - 10)

    // Calculate distance from each edge (0-1 range)
    const distanceFromLeft = Math.min(scrollLeft / 100, 1) // normalize to 0-1 over 100px
    const distanceFromRight = Math.min((maxScroll - scrollLeft) / 100, 1)

    // Width stays consistent
    setLeftGradientWidth(45 + distanceFromLeft * 90)
    setRightGradientWidth(45 + distanceFromRight * 90)

    // Crossfade opacity: as you approach the end, right fades out and left fades in
    // Use distanceFromRight for both to create the crossfade effect
    setLeftGradientOpacity(Math.max(0, 1 - distanceFromRight)) // Fades in as you approach end
    setRightGradientOpacity(distanceFromRight) // Fades out as you approach end
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !isMobile) return

    // Initial check
    handleScroll()

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  let style = null

  const count = items.length
  const perRow = Math.ceil(count / mobileItemsRows)

  if (isMobile) {
    const horizontalPadding = theme.grid.gutter.mobile * 4 // left (2x) + right (2x)
    const columnGaps = theme.spacing[2] * (perRow - 1) // gaps between columns
    style = {
      width: mobileItemWidth * perRow + horizontalPadding + columnGaps,
      gridTemplateColumns: `repeat(${perRow}, ${mobileItemWidth}px)`,
      minHeight: 0,
      minWidth: 0,
    }
  }

  return (
    <Wrapper show={insideGridContainer}>
      <Box
        marginTop={marginTop}
        marginBottom={marginBottom}
        className={styles.scrollContainer}
      >
        <Box className={styles.container} ref={scrollContainerRef}>
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
        {isMobile && showGradients && showLeftGradient && (
          <div
            className={styles.fadeOverlayLeft}
            style={{
              width: `${leftGradientWidth}px`,
              opacity: leftGradientOpacity,
            }}
            aria-hidden="true"
          />
        )}
        {isMobile && showGradients && showRightGradient && (
          <div
            className={styles.fadeOverlayRight}
            style={{
              width: `${rightGradientWidth}px`,
              opacity: rightGradientOpacity,
            }}
            aria-hidden="true"
          />
        )}
      </Box>
    </Wrapper>
  )
}

type WrapperProps = {
  show: boolean
  children: JSX.Element
}

const Wrapper: FC<React.PropsWithChildren<WrapperProps>> = ({
  show = false,
  children,
}) =>
  show ? (
    <GridContainer className={styles.gridContainer}>{children}</GridContainer>
  ) : (
    children
  )

export default GridItems
