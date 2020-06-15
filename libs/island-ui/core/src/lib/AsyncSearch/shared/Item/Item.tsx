import React from 'react'
import cn from 'classnames'

import * as styles from './Item.treat'

export const Item = ({
  children,
  isSelected,
  isActive,
  highlightedIndex,
  index,
  colored,
  size,
  ...props
}) => {
  const selectedClass = colored ? styles.selectedColored : styles.selected
  const colorClass = colored ? styles.colored : styles.plain
  const isPrev = index === highlightedIndex - 1

  return (
    <li
      {...props}
      className={cn(styles.item, colorClass, styles.sizes[size], {
        [selectedClass]: isActive,
      })}
    >
      {children}
      <span
        className={cn(styles.divider, {
          [styles.dividerVisible]: !isPrev && !isActive,
        })}
      />
    </li>
  )
}

export default Item
