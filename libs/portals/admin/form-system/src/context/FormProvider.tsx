import { useCallback, useMemo, useReducer, useState } from "react"
import { ControlContext, IControlContext } from "./ControlContext"
import { FormSystemForm, FormSystemFormResponse, FormSystemSection, FormSystemSectionDtoSectionTypeEnum } from "@island.is/api/schema"
import { ControlState, controlReducer } from "../hooks/controlReducer"
import { ActiveItem, NavbarSelectStatus } from "../lib/utils/interfaces"
import { removeTypename } from "../lib/utils/removeTypename"
import { updateDnd } from "../lib/utils/updateDnd"
import { defaultStep } from "../lib/utils/defaultStep"
import { baseSettingsStep } from "../lib/utils/getBaseSettingsSection"
import { updateActiveItemFn } from "../lib/utils/updateActiveItem"
import { useMutation } from "@apollo/client"
import { UPDATE_FIELD, UPDATE_FIELDS_DISPLAY_ORDER, UPDATE_FORM, UPDATE_SCREEN, UPDATE_SCREEN_DISPLAY_ORDER, UPDATE_SECTION, UPDATE_SECTION_DISPLAY_ORDER } from "@island.is/form-system/graphql"



export const FormProvider: React.FC<{ children: React.ReactNode, formBuilder: FormSystemFormResponse }> = ({ children, formBuilder }) => {
  const [focus, setFocus] = useState<string>('')
  const [inSettings, setInSettings] = useState(formBuilder?.form?.name?.is === '')
  const [inListBuilder, setInListBuilder] = useState(false)
  const [selectStatus, setSelectStatus] = useState<NavbarSelectStatus>(
    NavbarSelectStatus.OFF,
  )

  const { fieldTypes, listTypes, certificationTypes, form } = formBuilder

  const initialControl: ControlState = {
    activeItem: {
      type: 'Section',
      data: inSettings
        ? baseSettingsStep
        : removeTypename(form?.sections)?.find(
          (s: FormSystemSection) => s?.sectionType === FormSystemSectionDtoSectionTypeEnum.Input,
        ) ?? defaultStep,
    },
    activeListItem: null,
    form: removeTypename(form) as FormSystemForm,
  }
  console.log('initialForm', form)

  const [control, controlDispatch] = useReducer(controlReducer, initialControl)

  const updateSection = useMutation(UPDATE_SECTION)
  const updateScreen = useMutation(UPDATE_SCREEN)
  const updateField = useMutation(UPDATE_FIELD)
  const updateActiveItem = useCallback((updatedActiveItem?: ActiveItem) =>
    updateActiveItemFn(control.activeItem, updateSection, updateScreen, updateField, updatedActiveItem), [control.activeItem, updateSection, updateScreen, updateField])

  const [updateSectionDisplayOrder] = useMutation(UPDATE_SECTION_DISPLAY_ORDER)
  const [updateScreenDisplayOrder] = useMutation(UPDATE_SCREEN_DISPLAY_ORDER)
  const [updateFieldDisplayOrder] = useMutation(UPDATE_FIELDS_DISPLAY_ORDER)
  const updateDragAndDrop = useCallback(() =>
    updateDnd(control, updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder), [control, updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder])

  const [updateForm] = useMutation(UPDATE_FORM)
  const formUpdate = async (updatedForm?: FormSystemForm) => {
    const newForm = updatedForm ? updatedForm : control.form
    try {
      const response = await updateForm({
        variables: {
          input: {
            id: control.form.id,
            updateFormDto: {
              organizationId: newForm.organizationId,
              name: newForm.name,
              slug: newForm.slug,
              invalidationDate: newForm.invalidationDate === null ? undefined : newForm.invalidationDate,
              isTranslated: newForm.isTranslated,
              applicationDaysToRemove: newForm.applicationDaysToRemove,
              stopProgressOnValidatingScreen: newForm.stopProgressOnValidatingScreen,
              completedMessage: newForm.completedMessage,
              dependencies: newForm.dependencies ?? [],
            }
          }
        }
      })

      // Optionally handle the response
      console.log('Form updated successfully:', response.data)

    } catch (err) {
      // Handle the error case
      console.error('Error updating form:', err.message)
    }
  }

  const context: IControlContext = useMemo(() => ({
    control,
    controlDispatch,
    certificationTypes,
    fieldTypes,
    listTypes,
    setInSettings,
    inSettings,
    updateActiveItem,
    focus,
    setFocus,
    updateDnD: updateDragAndDrop,
    selectStatus,
    setSelectStatus,
    inListBuilder,
    setInListBuilder,
    formUpdate
  }), [control, controlDispatch])

  return (
    <ControlContext.Provider value={context}>
      {children}
    </ControlContext.Provider>
  )
}
