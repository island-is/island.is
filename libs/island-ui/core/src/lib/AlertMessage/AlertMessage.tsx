import * as React from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'

import * as styles from './AlertMessage.treat'
import { Icon } from '../Icon/Icon'

export type AlertMessageType = 'info' | 'error'

export interface AlertMessageProps {
  type: AlertMessageType
  title: string
  message: string
}

export const AlertMessage: React.FC<AlertMessageProps> = (
  props: AlertMessageProps,
) => {
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
        <Text as="h5" variant="h5">
          {props.title}
        </Text>
      </div>
      <div className={styles.messageContainer}>
        <Text variant="small">{props.message}</Text>
      </div>
    </div>
  )
}
