import { coreMessages, MessageFormatter } from '@island.is/application/core'
import { toast } from '@island.is/island-ui/core'

export function handleSubmitError(
  error: string,
  formatMessage: MessageFormatter,
): void {
  toast.error(formatMessage(coreMessages.updateOrSubmitError, { error }))
}

type SelectOption = {
  label: string
  value: string
}

export function getSelectOptionLabel(options: SelectOption[], id?: string) {
  if (id === undefined) {
    return undefined
  }

  return options.find((option) => option.value === id)?.label
}
