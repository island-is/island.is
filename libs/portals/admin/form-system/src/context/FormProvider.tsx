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
import { useFormMutations } from "../hooks/formProviderHooks"


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

  const updateActiveItem = useCallback((updatedActiveItem?: ActiveItem) =>
    updateActiveItemFn(control.activeItem, updatedActiveItem), [control])


  const updateDragAndDrop = useCallback(() =>
    updateDnd(control), [control])

  const { updateForm } = useFormMutations()

  const formUpdate = (updatedForm?: FormSystemForm) => {
    if (updatedForm) {
      updateForm[0]({
        variables: {
          input: {
            id: updatedForm.id,
            updateFormDto: {
              ...updatedForm
            }
          }
        }
      })
    } else {
      updateForm[0]({
        variables: {
          input: {
            id: control.form.id,
            updateFormDto: {
              ...control.form
            }
          }
        }
      })
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
