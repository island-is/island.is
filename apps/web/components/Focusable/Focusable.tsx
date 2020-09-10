import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Focusable.treat'

interface Props {}

const Focusable: FC<Props> = ({ children }) => {
  const isFocused = false
  return (
    <div className={cn(styles.focusable, { [styles.focused]: isFocused })}>
      {children}
    </div>
  )
}

export default Focusable
