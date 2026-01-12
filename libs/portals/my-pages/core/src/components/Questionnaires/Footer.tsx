import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { m } from '../../lib/messages'

interface FooterButtonsProps {
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  submitDisabled?: boolean
  submitting?: boolean
}

export const QuestionnaireFooter: FC<FooterButtonsProps> = ({
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  submitDisabled = false,
  submitting = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      paddingX={[0, 0, 0, 3]}
      paddingY={2}
      paddingBottom={4}
    >
      <Box>
        <Button
          variant="ghost"
          onClick={onCancel}
          preTextIcon="arrowBack"
          disabled={submitting}
        >
          {cancelLabel ? cancelLabel : formatMessage(m.buttonCancel)}
        </Button>
      </Box>
      <Box>
        <Button
          disabled={submitDisabled}
          variant="primary"
          onClick={onSubmit}
          icon="arrowForward"
          loading={submitting}
        >
          {submitLabel ? submitLabel : formatMessage(m.submit)}
        </Button>
      </Box>
    </Box>
  )
}
