import { forwardRef, ReactNode } from 'react'
import cn from 'classnames'

import * as styles from './RegulationTag.css'
import { Text, Icon } from '@island.is/island-ui/core'

export interface RegulationTagProps {
  onClick?: () => void
  id?: string
  active?: boolean
  disabled?: boolean
  children: string | ReactNode
  truncate?: boolean
  removable?: boolean
}

export const RegulationTag = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  RegulationTagProps
>(
  (
    {
      children,
      onClick,
      removable,
      active,
      disabled,
      truncate,
      ...props
    }: RegulationTagProps,
    ref,
  ) => {
    const className = cn(styles.container, styles.variants['blue'], {
      [styles.active]: active,
      [styles.focusable]: !disabled,
      [styles.truncate]: truncate,
    })

    const sharedProps = {
      className,
      ref,
    }

    const renderCloseIcon = removable && !!onClick

    const content = (
      <Text variant="eyebrow" as="span" truncate={truncate}>
        {children}
        {renderCloseIcon && <Icon icon="close" className={styles.closeIcon} />}
      </Text>
    )

    if (disabled) {
      return <span {...sharedProps}>{content}</span>
    }

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        {...sharedProps}
        {...props}
      >
        {content}
      </button>
    )
  },
)
