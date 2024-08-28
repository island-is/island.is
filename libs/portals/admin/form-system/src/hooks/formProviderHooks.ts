import { MutationHookOptions, useLazyQuery } from '@apollo/client'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  UPDATE_FIELD,
  UPDATE_FIELDS_DISPLAY_ORDER,
  UPDATE_SCREEN,
  UPDATE_SCREEN_DISPLAY_ORDER,
  UPDATE_SECTION,
  UPDATE_SECTION_DISPLAY_ORDER,
} from '@island.is/form-system/graphql'



const createMutationHook = (mutation: any, options: MutationHookOptions = {}) =>
  useLazyQuery(mutation, {
    ...options,
    onError: (error) => {
      console.error(error, error.message)
      options.onError?.(error)
    },
  })

export const useFormMutations = () => {
  const [updateSection] = createMutationHook(UPDATE_SECTION)
  const [updateSectionDisplayOrder] = createMutationHook(UPDATE_SECTION_DISPLAY_ORDER)
  const [updateScreen] = createMutationHook(UPDATE_SCREEN)
  const [updateScreenDisplayOrder] = createMutationHook(UPDATE_SCREEN_DISPLAY_ORDER)
  const [updateField] = createMutationHook(UPDATE_FIELD)
  const [updateFieldDisplayOrder] = createMutationHook(UPDATE_FIELDS_DISPLAY_ORDER)


  return { updateSection, updateScreen, updateField, updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder }
}
