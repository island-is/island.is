import React, { FC } from 'react'
import cx from 'classnames'
import { Box, BoxProps, GridContainer } from '@island.is/island-ui/core'

import * as styles from './GridItems.css'

type GridItemsProps = {
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
  paddingTop?: BoxProps['paddingTop']
  paddingBottom?: BoxProps['paddingBottom']
  insideGridContainer?: boolean
  half?: boolean
}

export const GridItems: FC<GridItemsProps> = ({
  marginTop = 0,
  marginBottom = 0,
  paddingTop = 0,
  paddingBottom = 0,
  insideGridContainer = false,
  half = false,
  children,
}) => (
  <Wrapper show={insideGridContainer}>
    <Box
      marginTop={marginTop}
      marginBottom={marginBottom}
      className={styles.container}
    >
      <Box
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        className={cx(styles.wrapper, { [styles.half]: half })}
      >
        {children}
      </Box>
    </Box>
  </Wrapper>
)

type WrapperProps = {
  show: boolean
  children: JSX.Element
}

const Wrapper: FC<WrapperProps> = ({ show = false, children }) =>
  show ? (
    <GridContainer className={styles.gridContainer}>{children}</GridContainer>
  ) : (
    children
  )

export default GridItems
