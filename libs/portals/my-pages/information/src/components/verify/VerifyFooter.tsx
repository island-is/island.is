import { forwardRef, MouseEvent, useId } from 'react'

import { Box, Button, LoadingDots } from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'
import omit from 'lodash/omit'

type LinkProps = {
  label: string
  onClick(): void
  loading?: boolean
}

type BaseButtonProps = {
  loading?: boolean
  disabled?: boolean
  label: string
  ariaLabelButtonDisabled?: string
  ariaLabelLoading?: string
}

interface ButtonProps extends BaseButtonProps {
  type?: HTMLButtonElement['type']
  onClick?(e: MouseEvent<HTMLButtonElement>): void
}

type BaseProps = {
  button?: ButtonProps
  link?: LinkProps
}

interface WithButtonProps extends BaseProps {
  button: ButtonProps
  link?: never
}

interface WithLinkProps extends BaseProps {
  button?: never
  link?: LinkProps
  ariaSubmitButtonDisabledLabel?: never
}

interface WithBothProps {
  button: ButtonProps
  link: LinkProps
}

type VerifyFooterProps = WithBothProps | WithButtonProps | WithLinkProps

export const VerifyFooter = forwardRef<HTMLButtonElement, VerifyFooterProps>(
  ({ button, link }, ref) => {
    const ariaLabel = button?.ariaLabelButtonDisabled ?? button?.label
    const disabledReasonId = `disabledReason-${useId()}`

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (button?.disabled) {
        e.preventDefault()

        return
      }

      button?.onClick?.(e)
    }

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        rowGap={3}
        width="full"
      >
        {button && (
          <Button
            {...omit(button, [
              'onClick',
              'ariaLabelLoading',
              'ariaLabelButtonDisabled',
            ])}
            onClick={handleButtonClick}
            {...(ariaLabel &&
              button.ariaLabelLoading && {
                'aria-busy': button.ariaLabelLoading,
              })}
            {...(ariaLabel &&
              button.disabled && {
                'aria-disabled': true,
                'aria-describedby': disabledReasonId,
              })}
            fluid
            ref={ref}
          >
            {button.label}
          </Button>
        )}
        {ariaLabel && (
          <span className={helperStyles.srOnly} id={disabledReasonId}>
            {ariaLabel}
          </span>
        )}
        {link &&
          (link.loading ? (
            <Box marginTop={1}>
              <LoadingDots />
            </Box>
          ) : (
            <Button variant="text" onClick={link.onClick}>
              {link.label}
            </Button>
          ))}
      </Box>
    )
  },
)
