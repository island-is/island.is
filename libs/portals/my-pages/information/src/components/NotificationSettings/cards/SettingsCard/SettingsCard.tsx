import React, { FC } from 'react'
import { Text, ToggleSwitchButton } from '@island.is/island-ui/core'

import * as styles from './SettingsCard.css'

interface SettingsCardProps {
  title: string
  subtitle: string
  toggleLabel?: string
  checked: boolean
  onChange(active: boolean): void
}

export const SettingsCard: FC<SettingsCardProps> = ({
  title,
  subtitle,
  toggleLabel,
  checked,
  onChange,
}) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <Text variant="h5" as="h4" marginBottom={1}>
          {title}
        </Text>
        <Text variant="medium">{subtitle}</Text>
      </div>

      <ToggleSwitchButton
        label={toggleLabel || title}
        checked={checked}
        onChange={onChange}
        hiddenLabel
        className={styles.toggleButton}
      />
    </div>
  )
}
