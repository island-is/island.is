import {
  ApplicationState,
  hasFieldValueError as hasError,
} from '@island.is/form-system/ui'
import { FormSystemField } from '@island.is/api/schema'

export { hasFieldValueError as hasError } from '@island.is/form-system/ui'

export const validateScreen = (state: ApplicationState): string[] => {
  const { currentScreen } = state
  if (!currentScreen) return []
  const { data } = currentScreen
  const requiredFields = data?.fields?.filter((field) => field?.isRequired)
  const errors =
    requiredFields
      ?.filter(
        (field): field is FormSystemField => field !== null && hasError(field),
      )
      .map((field) => field.id) ?? []

  return errors
}
