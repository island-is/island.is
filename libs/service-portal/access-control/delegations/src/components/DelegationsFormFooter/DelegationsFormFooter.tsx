import { coreMessages } from '@island.is/application/core'
import { Box, Button, ButtonProps } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './DelegationsFormFooter.css'

type DelegationsFormFooterProps = {
  loading?: boolean
  disabled?: boolean
  submitLabel?: string
  onCancel?(): void
  onConfirm?(): void
  buttonSize?: ButtonProps['size']
}

export const DelegationsFormFooter = ({
  onCancel,
  onConfirm,
  submitLabel,
  buttonSize = 'medium',
  ...rest
}: DelegationsFormFooterProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      borderTopWidth="standard"
      borderColor="blue200"
      width="full"
      paddingTop={4}
      className={styles.container}
    >
      <Button size={buttonSize} variant="ghost" onClick={onCancel}>
        {formatMessage(coreMessages.buttonCancel)}
      </Button>
      <Button
        size={buttonSize}
        type={onConfirm ? 'button' : 'submit'}
        icon="arrowForward"
        {...(onConfirm && { onClick: onConfirm })}
        {...rest}
      >
        {submitLabel}
      </Button>
    </Box>
  )
}
