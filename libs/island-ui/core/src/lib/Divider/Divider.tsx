import React from 'react'
import { BoxProps } from '../Box/types'
import { Box } from '../Box/Box'
import * as styles from './Divider.treat'

export interface DividerProps {
  weight?: keyof typeof styles.weight
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
}

export const Divider = (props: DividerProps) => (
  <Box
    width="full"
    className={[styles.base, styles.weight[props.weight || 'regular']]}
    marginTop={props.marginTop}
    marginBottom={props.marginBottom}
  />
)
