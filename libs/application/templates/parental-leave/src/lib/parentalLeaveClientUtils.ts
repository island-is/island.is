import { coreMessages, MessageFormatter } from '@island.is/application/core'
import { toast } from '@island.is/island-ui/core'

export function handleSubmitError(
  error: string,
  formatMessage: MessageFormatter,
): void {
  toast.error(formatMessage(coreMessages.updateOrSubmitError, { error }))
}
