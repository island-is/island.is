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
import { useLazyQuery } from "@apollo/client"
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UPDATE_FIELD, UPDATE_FIELDS_DISPLAY_ORDER, UPDATE_FORM, UPDATE_SCREEN, UPDATE_SCREEN_DISPLAY_ORDER, UPDATE_SECTION, UPDATE_SECTION_DISPLAY_ORDER } from "@island.is/form-system/graphql"



export const FormProvider: React.FC<{ children: React.ReactNode, form: FormSystemFormResponse }> = ({ children, form }) => {
  const [focus, setFocus] = useState<string>('')
  const [inSettings, setInSettings] = useState(form?.form?.name?.is === '')
  const [inListBuilder, setInListBuilder] = useState(false)
  const [selectStatus, setSelectStatus] = useState<NavbarSelectStatus>(
    NavbarSelectStatus.OFF,
  )
  const { fieldTypes, listTypes, certificationTypes } = form

  const initialControl: ControlState = {
    activeItem: {
      type: 'Section',
      data: inSettings
        ? baseSettingsStep
        : removeTypename(form?.form?.sections)?.find(
          (s: FormSystemSection) => s?.sectionType === FormSystemSectionDtoSectionTypeEnum.Input,
        ) ?? defaultStep,
    },
    activeListItem: null,
    form: removeTypename(form) as FormSystemForm,
  }

  const [control, controlDispatch] = useReducer(controlReducer, initialControl)

  //const { updateForm, updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder, updateSection, updateScreen, updateField } = useFormMutations()
  const [updateSection] = useLazyQuery(UPDATE_SECTION)
  const [updateScreen] = useLazyQuery(UPDATE_SCREEN)
  const [updateField] = useLazyQuery(UPDATE_FIELD)
  const updateActiveItem = useCallback((updatedActiveItem?: ActiveItem) =>
    updateActiveItemFn(control.activeItem, updateSection, updateScreen, updateField, updatedActiveItem), [control.activeItem, updateSection, updateScreen, updateField])

  const [updateSectionDisplayOrder] = useLazyQuery(UPDATE_SECTION_DISPLAY_ORDER)
  const [updateScreenDisplayOrder] = useLazyQuery(UPDATE_SCREEN_DISPLAY_ORDER)
  const [updateFieldDisplayOrder] = useLazyQuery(UPDATE_FIELDS_DISPLAY_ORDER)
  const updateDragAndDrop = useCallback(() =>
    updateDnd(control, updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder), [control, updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder])

  const [updateForm] = useLazyQuery(UPDATE_FORM)
  const formUpdate = (updatedForm?: FormSystemForm) => {
    updateForm({
      variables: {
        input: {
          id: control.form.id,
          updateFormDto: {
            ...(updatedForm ? updatedForm : control.form)
          }
        }
      }
    })
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
