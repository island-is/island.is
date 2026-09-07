import { FC } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'

// Shared by every draft-backed screen while its content is loading.
export const DraftLoadingState: FC = () => (
  <Box display="flex" justifyContent="center" paddingY={5}>
    <LoadingDots />
  </Box>
)

// Shared by every draft-backed screen when its content failed to load —
// `onRetry` is the caller's own refetch (single or combined across queries).
export const DraftErrorState: FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <AlertMessage
        type="error"
        message={formatMessage(messages.errors.draftLoadFailed)}
      />
      <Box marginTop={2}>
        <Button variant="ghost" size="small" icon="reload" onClick={onRetry}>
          {formatMessage(messages.errors.retryButton)}
        </Button>
      </Box>
    </Box>
  )
}
