import React from 'react'
import cn from 'classnames'
import { Typography } from '../Typography/Typography'

import * as styles from './Alert.treat'
import { Icon } from '../Icon/Icon'

export type AlertType = 'info' | 'error'

export interface AlertProps {
  type: AlertType
  title: string
  message: string
}

export const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  const className = cn(styles.container, styles.containerVariants[props.type])

  return (
    <div className={className}>
      <div className={styles.titleContainer}>
        <div className={styles.iconContainer}>
          <Icon
            type={props.type === 'error' ? 'alert' : 'info'}
            color={props.type === 'error' ? 'red400' : 'blue400'}
            width={32}
            height={32}
          />
        </div>
        <Typography as="h5" variant="h5">
          {props.title}
        </Typography>
      </div>
      <div className={styles.messageContainer}>
        <Typography variant="pSmall">{props.message}</Typography>
      </div>
    </div>
  )
}
