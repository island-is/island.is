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
  third?: boolean
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
  third = false,
  children,
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  const items = Children.toArray(children)

  useEffect(() => {
    if (third) {
      setIsMobile(width < theme.breakpoints.lg)
    } else {
      setIsMobile(width < theme.breakpoints.sm)
    }
  }, [third, width])

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
      <Box
        marginTop={marginTop}
        marginBottom={marginBottom}
        className={styles.container}
      >
        <Box
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          className={cx(styles.wrapper, {
            [styles.half]: half,
            [styles.third]: third,
          })}
          {...(style && { style })}
        >
          {children}
        </Box>
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
