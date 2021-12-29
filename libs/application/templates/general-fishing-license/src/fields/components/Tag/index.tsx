import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'
import * as styles from './Tag.css'

export type TagVariant =
  | 'blue'
  | 'darkerBlue'
  | 'purple'
  | 'white'
  | 'red'
  | 'rose'
  | 'blueberry'
  | 'dark'

export interface TagProps {
  variant?: TagVariant
  disabled?: boolean
  children: string | ReactNode
}

export const Tag = forwardRef<HTMLButtonElement & HTMLAnchorElement, TagProps>(
  ({ children, variant = 'blue', disabled = false }: TagProps, ref) => {
    const className = cn(styles.container, styles.variants[variant], {
      [styles.disabled]: disabled,
    })

    const sharedProps = {
      className,
      ref,
    }

    const content = (
      <Text variant="eyebrow" as="span">
        {children}
      </Text>
    )

    return <span {...sharedProps}>{content}</span>
  },
)
