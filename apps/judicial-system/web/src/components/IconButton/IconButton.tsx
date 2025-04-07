import { forwardRef, MouseEvent } from 'react'
import cn from 'classnames'
import { Button } from 'reakit'

import { Box, Icon, IconMapIcon } from '@island.is/island-ui/core'

import * as styles from './IconButton.css'

interface Props {
  icon: IconMapIcon
  colorScheme: 'blue' | 'red' | 'transparent'
  onClick?: (evt: MouseEvent) => void
  disabled?: boolean
}

const IconButton = forwardRef<HTMLButtonElement, Props>(({ ...props }, ref) => {
  const { icon, colorScheme, onClick, disabled } = props

  return (
    <Box
      component={Button}
      ref={ref}
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
      onClick={(evt) => onClick && onClick(evt)}
      disabled={disabled}
      aria-label="Opna valmöguleika fyrir mál"
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
})

export default IconButton
