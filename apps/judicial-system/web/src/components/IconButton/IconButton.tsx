import React from 'react'
import cn from 'classnames'

import { Box, Icon, IconMapIcon } from '@island.is/island-ui/core'

import * as styles from './IconButton.css'

interface Props {
  icon: IconMapIcon
  colorScheme: 'blue' | 'red' | 'transparent'
  onClick: (evt: React.MouseEvent) => void
  disabled?: boolean
}

const IconButton: React.FC<Props> = (props) => {
  const { icon, colorScheme, onClick, disabled } = props

  return (
    <Box
      component="button"
      className={cn(styles.iconButtonContainer, {
        [styles.buttonDisabled]: disabled,
        [styles.transparent]: colorScheme === 'transparent',
      })}
      background={
        colorScheme === 'blue'
          ? 'blue200'
          : colorScheme === 'red'
          ? 'red200'
          : 'transparent'
      }
      onClick={(evt) => onClick(evt)}
      disabled={disabled}
    >
      <Icon
        icon={icon}
        color={
          colorScheme === 'blue' || colorScheme === 'transparent'
            ? 'blue400'
            : 'red400'
        }
        size="small"
      />
    </Box>
  )
}

export default IconButton
