import { forwardRef, MouseEvent } from 'react'
import cn from 'classnames'
import { Button } from '@ariakit/react/button'

import { Box, Icon, IconMapIcon, Tooltip } from '@island.is/island-ui/core'

import * as styles from './IconButton.css'

interface Props {
  icon: IconMapIcon
  colorScheme: 'blue' | 'red' | 'transparent'
  onClick?: (evt: MouseEvent) => void
  disabled?: boolean
  tooltipText?: string
  ariaLabel?: string
}

interface RenderButtonProps {
  icon: IconMapIcon
  colorScheme: 'blue' | 'red' | 'transparent'
  onClick?: (evt: MouseEvent) => void
  disabled?: boolean
  ariaLabel?: string
}

const RenderButton = forwardRef<HTMLButtonElement, RenderButtonProps>(
  ({ icon, colorScheme, onClick, disabled, ariaLabel }, ref) => (
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
      aria-label={ariaLabel ?? 'Valmynd'}
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
  ),
)

const IconButton = forwardRef<HTMLButtonElement, Props>(({ ...props }, ref) => {
  const { icon, colorScheme, onClick, disabled, tooltipText, ariaLabel } = props

  return tooltipText ? (
    <Tooltip placement="top" text={tooltipText}>
      <span>
        <RenderButton
          icon={icon}
          colorScheme={colorScheme}
          onClick={onClick}
          disabled={disabled}
          ariaLabel={ariaLabel}
          ref={ref}
        />
      </span>
    </Tooltip>
  ) : (
    <RenderButton
      icon={icon}
      colorScheme={colorScheme}
      onClick={onClick}
      disabled={disabled}
      ariaLabel={ariaLabel}
      ref={ref}
    />
  )
})

export default IconButton
