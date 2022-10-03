import { coreMessages } from '@island.is/application/core'
import { Box, Button, ButtonProps } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

type DelegationsFormFooterProps = {
  loading?: boolean
  disabled?: boolean
  submitLabel?: string
  onCancel?(): void
  buttonSize?: ButtonProps['size']
}

export const DelegationsFormFooter = ({
  onCancel,
  submitLabel,
  buttonSize = 'medium',
  ...rest
}: DelegationsFormFooterProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" alignItems="center" justifyContent="spaceBetween">
      <Button size={buttonSize} variant="ghost" onClick={onCancel}>
        {formatMessage(coreMessages.buttonCancel)}
      </Button>
      <Button size={buttonSize} type="submit" icon="arrowForward" {...rest}>
        {submitLabel}
      </Button>
    </Box>
  )
}
