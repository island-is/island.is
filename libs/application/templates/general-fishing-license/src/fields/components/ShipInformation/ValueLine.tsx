import { Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './ValueLine.css'

interface ShipInformationProps {
  label: string
  value: string
  color?: 'black' | 'green' | 'red' | 'grey'
  disabled?: boolean
}

export const ValueLine: FC<React.PropsWithChildren<ShipInformationProps>> = ({
  label,
  value,
  color = 'black',
  disabled = false,
}) => {
  return (
    <Text
      variant="small"
      marginBottom="smallGutter"
      color={disabled ? 'dark300' : 'dark400'}
    >
      <strong>{label}:</strong>{' '}
      <span className={styles.colorVariant[color]}>{value}</span>
    </Text>
  )
}
