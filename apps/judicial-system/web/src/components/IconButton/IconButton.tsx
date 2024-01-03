import React from 'react'

import { Icon, IconMapIcon } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

import * as styles from './IconButton.css'

interface Props {
  icon: IconMapIcon
  color: Colors
  onClick: () => void
}

const IconButton: React.FC<Props> = (props) => {
  const { icon, color, onClick } = props

  return (
    <button className={styles.iconButtonContainer} onClick={() => onClick()}>
      <Icon icon={icon} color={color} size="small" />
    </button>
  )
}

export default IconButton
