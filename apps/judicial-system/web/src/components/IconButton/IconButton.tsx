import { ComponentPropsWithoutRef, forwardRef, MouseEvent } from 'react'
import cn from 'classnames'
import { Button } from '@ariakit/react/button'

import { Box, Icon, IconMapIcon, Tooltip } from '@island.is/island-ui/core'

import * as styles from './IconButton.css'

// Remaining button props (aria attributes, event handlers, ...) are forwarded to
// the underlying button so components like ContextMenu can drive it.
interface Props extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
  icon: IconMapIcon
  colorScheme: 'blue' | 'red' | 'transparent'
  onClick?: (evt: MouseEvent) => void
  disabled?: boolean
  tooltipText?: string
  // Required: icon-only buttons need a descriptive accessible name.
  ariaLabel: string
}

type RenderButtonProps = Omit<Props, 'tooltipText'>

const RenderButton = forwardRef<HTMLButtonElement, RenderButtonProps>(
  (
    { icon, colorScheme, onClick, disabled, ariaLabel, className, ...rest },
    ref,
  ) => (
    <Box
      {...rest}
      component={Button}
      ref={ref}
      className={cn(styles.iconButtonContainer, className, {
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
      aria-label={ariaLabel}
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

const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ tooltipText, ...props }, ref) =>
    tooltipText ? (
      <Tooltip placement="top" text={tooltipText}>
        <span>
          <RenderButton {...props} ref={ref} />
        </span>
      </Tooltip>
    ) : (
      <RenderButton {...props} ref={ref} />
    ),
)

export default IconButton
