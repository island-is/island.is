import { coreMessages } from '@island.is/application/core'
import {
  Box,
  Button,
  ButtonProps,
  Divider,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { IconMapIcon as IconType } from '@island.is/island-ui/core'
import * as styles from './DelegationsFormFooter.css'

type DelegationsFormFooterProps = {
  loading?: boolean
  disabled?: boolean
  confirmLabel?: string
  onCancel?(): void
  onConfirm?(): void
  buttonSize?: ButtonProps['size']
  confirmIcon?: IconType
  confirmButtonColorScheme?: 'destructive' | 'default'
  showDivider?: boolean
  containerPaddingBottom?: ResponsiveSpace
}

export const DelegationsFormFooter = ({
  onCancel,
  onConfirm,
  confirmLabel,
  buttonSize = 'medium',
  confirmIcon,
  confirmButtonColorScheme = 'default',
  showDivider = true,
  containerPaddingBottom = 6,
  ...rest
}: DelegationsFormFooterProps) => {
  const { formatMessage } = useLocale()

  return (
    <>
      {showDivider && (
        <div className={styles.dividerContainer}>
          <Divider />
        </div>
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        width="full"
        paddingTop={4}
        paddingBottom={containerPaddingBottom}
        className={styles.container}
      >
        <Button size={buttonSize} variant="ghost" onClick={onCancel}>
          {formatMessage(coreMessages.buttonCancel)}
        </Button>
        <Button
          size={buttonSize}
          type={onConfirm ? 'button' : 'submit'}
          variant="primary"
          colorScheme={confirmButtonColorScheme}
          {...(confirmIcon && { icon: confirmIcon })}
          {...(onConfirm && { onClick: onConfirm })}
          {...rest}
        >
          {confirmLabel}
        </Button>
      </Box>
    </>
  )
}
