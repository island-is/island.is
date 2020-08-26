import React, { FC, useState } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { Icon } from '@island.is/island-ui/core'

import * as styles from './Sleeve.treat'

interface SleeveProps {
  open?: boolean
  minHeight?: number
}

export const Sleeve: FC<SleeveProps> = ({
  children,
  open = false,
  minHeight = 320,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  console.log('isOpen', isOpen)

  return (
    <div className={cn(styles.container, { [styles.open]: isOpen })}>
      <div className={styles.wrapper}>
        <AnimateHeight duration={1000} height={isOpen ? 'auto' : minHeight}>
          {children}
        </AnimateHeight>
      </div>
      <div className={styles.togglerWrapper}>
        <button
          className={cn(styles.toggler, { [styles.togglerOpen]: isOpen })}
          onClick={onToggle}
        >
          <Icon color="white" width="18" height="18" type="arrowUp" />
        </button>
      </div>
    </div>
  )
}

export default Sleeve
