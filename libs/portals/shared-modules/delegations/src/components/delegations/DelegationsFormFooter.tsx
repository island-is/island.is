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
import { m } from '@island.is/portals/core'

type DelegationsFormFooterProps = {
  loading?: boolean
  disabled?: boolean
  confirmLabel?: string
  onCancel?(): void
  onConfirm?(): void
  buttonSize?: ButtonProps['size']
  confirmIcon?: IconType
  confirmButtonColorScheme?: 'destructive' | 'default'
  showShadow?: boolean
  divider?: boolean
  containerPaddingBottom?: ResponsiveSpace
}

export const DelegationsFormFooter = ({
  onCancel,
  onConfirm,
  confirmLabel,
  buttonSize = 'medium',
  confirmIcon,
  confirmButtonColorScheme = 'default',
  showShadow = true,
  divider = true,
  containerPaddingBottom = 4,
  ...rest
}: DelegationsFormFooterProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box position="relative" className={styles.container}>
      <div className={styles.shadow({ showShadow })} />
      {divider && (
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
      >
        <Button size={buttonSize} variant="ghost" onClick={onCancel}>
          {formatMessage(m.buttonCancel)}
        </Button>
        <Button
          size={buttonSize}
          type={onConfirm ? 'button' : 'submit'}
          variant="primary"
          colorScheme={confirmButtonColorScheme}
          data-testid="proceed"
          {...(confirmIcon && { icon: confirmIcon })}
          {...(onConfirm && { onClick: onConfirm })}
          {...rest}
        >
          {confirmLabel}
        </Button>
      </Box>
    </Box>
  )
}
