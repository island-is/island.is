import React, { ReactNode } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

import { Label } from '../Label/Label'
import * as styles from './DataValue.css'

interface DataValueProps {
  label: string
  value: ReactNode | string
  error?: string
}

export const DataValue = ({ label, value, error }: DataValueProps) => (
  <Box className={styles.dataValue}>
    <Label>{label}</Label>

    {value === undefined ? (
      '—'
    ) : typeof value === 'string' ? (
      <Text>{value}</Text>
    ) : (
      value
    )}

    {error && (
      <Box className={styles.errorMessage} aria-live="assertive">
        {error}
      </Box>
    )}
  </Box>
)
