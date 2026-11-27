import { FormSystemValue } from '@island.is/api/schema'
import {
  applyDependencyVisibility,
  ApplicationState,
} from '@island.is/form-system/ui'
import { updatePaymentSectionVisibility } from '../utils/payment'

export const setFieldValue = (
  state: ApplicationState,
  fieldProperty: string,
  fieldId: string,
  value: FormSystemValue[keyof FormSystemValue],
  valueIndex = 0,
): ApplicationState => {
  const { currentScreen } = state
  if (!currentScreen?.data) return state

  const updatedScreen = {
    ...currentScreen.data,
    fields: currentScreen.data.fields?.map((field) => {
      if (field?.id !== fieldId) return field
      const values = [...(field.values ?? [])]
      const previous = values[valueIndex]
      values[valueIndex] = {
        ...previous,
        json: { ...previous?.json, [fieldProperty]: value },
      }
      return { ...field, values }
    }),
  }
  const updatedSections = state.sections.map((section) => ({
    ...section,
    screens: section.screens?.map((screen) =>
      screen?.id === updatedScreen.id ? updatedScreen : screen,
    ),
  }))
  const result =
    fieldProperty === 'checkboxValue' || fieldProperty === 'label'
      ? applyDependencyVisibility(
          updatedSections,
          state.application.dependencies ?? [],
        )
      : {
          sections: updatedSections,
          dependencies: state.application.dependencies,
        }
  const sections = updatePaymentSectionVisibility(
    result.sections,
    state.application.hasPayment,
  )
  return {
    ...state,
    sections,
    application: {
      ...state.application,
      sections,
      dependencies: result.dependencies,
    },
    currentSection: {
      ...state.currentSection,
      data: sections[state.currentSection.index],
    },
    currentScreen: {
      ...currentScreen,
      data:
        sections[state.currentSection.index]?.screens?.[currentScreen.index] ??
        undefined,
    },
    errors: state.errors ?? [],
  }
}
