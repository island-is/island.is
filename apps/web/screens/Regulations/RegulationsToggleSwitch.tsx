import React from 'react'
import cn from 'classnames'
import * as styles from './RegulationsToggleSwitch.treat'
import { Link, Text } from '@island.is/island-ui/core'

export interface ToggleSwitchProps {
  checked?: boolean
  large?: boolean
  hideLabel?: boolean
  label: string | JSX.Element
  className?: string
  href: string
}

export const RegulationsToggleSwitch = ({
  checked,
  large,
  label,
  hideLabel,
  className,
  href,
}: ToggleSwitchProps) => {
  return (
    <div className={cn(styles.container, large, className)}>
      <Link
        href={href}
        className={cn(styles.label, {
          [styles.labelChecked]: checked,
        })}
      >
        {!hideLabel && (
          <span className={styles.labelText}>
            <Text>{label}</Text>
          </span>
        )}
        <div
          className={cn(styles.toggleSwitch, {
            [styles.toggleSwitchLarge]: large,
            [styles.toggleSwitchChecked]: checked,
          })}
        >
          <span
            className={cn(styles.toggleSwitchKnob, {
              [styles.toggleSwitchKnobLarge]: large,
              [styles.toggleSwitchKnobChecked]: checked,
            })}
          ></span>
        </div>
      </Link>
    </div>
  )
}
