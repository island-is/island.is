import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'

import { Label } from '../Label/Label'
import * as styles from './RadioValue.css'

interface RadioValueProps {
  label?: string
  value: 'yes' | 'no'
}

export const RadioValue = ({ label, value }: RadioValueProps) => {
  const { formatMessage } = useLocale()
  const answer = value?.toLowerCase()

  if (answer !== 'no' && answer !== 'yes') {
    console.warn(
      `This component is only used to handle radio answer 'yes' or 'no'. ${label} ${value}`,
    )
  }

  return (
    <Box className={styles.radioValue}>
      {label && <Label>{label}</Label>}

      <Text>
        {answer === undefined
          ? '—'
          : answer === 'no'
          ? formatMessage(coreMessages.radioNo)
          : formatMessage(coreMessages.radioYes)}
      </Text>
    </Box>
  )
}
