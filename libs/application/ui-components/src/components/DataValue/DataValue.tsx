import React, { ReactNode } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

import { Label } from '../Label/Label'
import * as styles from './DataValue.treat'

interface DataValueProps {
  label: string
  value: ReactNode | string
}

export const DataValue = ({ label, value }: DataValueProps) => (
  <Box className={styles.dataValue}>
    <Label>{label}</Label>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Box>
)
