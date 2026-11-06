import { Box, Button } from '@island.is/island-ui/core'

interface Props {
  cancelLabel: string
  submitLabel: string
  onCancel: () => void
  onSubmit: () => void
  submitDisabled: boolean
  loading?: boolean
  fluid?: boolean
}

export const ConversationCancelSubmit = ({
  cancelLabel,
  submitLabel,
  onCancel,
  onSubmit,
  submitDisabled,
  loading,
  fluid,
}: Props) => {
  return (
    <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
      <Box flexGrow={fluid ? 1 : undefined}>
        <Button
          variant="ghost"
          size="medium"
          onClick={onCancel}
          disabled={loading}
          fluid={fluid}
        >
          {cancelLabel}
        </Button>
      </Box>
      <Box flexGrow={fluid ? 1 : undefined}>
        <Button
          onClick={onSubmit}
          size="medium"
          loading={loading}
          disabled={submitDisabled}
          fluid={fluid}
        >
          {submitLabel}
        </Button>
      </Box>
    </Box>
  )
}

export default ConversationCancelSubmit
