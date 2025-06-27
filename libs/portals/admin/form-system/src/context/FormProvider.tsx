import { useCallback, useMemo, useReducer, useState } from 'react'
import { ControlContext, IControlContext } from './ControlContext'
import {
  FormSystemForm,
  FormSystemFormResponse,
  FormSystemSection,
} from '@island.is/api/schema'
import { ControlState, controlReducer } from '../hooks/controlReducer'
import { ActiveItem, NavbarSelectStatus } from '../lib/utils/interfaces'
import { removeTypename } from '../lib/utils/removeTypename'
import { updateDnd } from '../lib/utils/updateDnd'
import { defaultStep } from '../lib/utils/defaultStep'
import { baseSettingsStep } from '../lib/utils/getBaseSettingsSection'
import { updateActiveItemFn } from '../lib/utils/updateActiveItem'
import { useMutation } from '@apollo/client'
import {
  GET_GOOGLE_TRANSLATION,
  UPDATE_FIELD,
  UPDATE_FIELDS_DISPLAY_ORDER,
  UPDATE_FORM,
  UPDATE_SCREEN,
  UPDATE_SCREEN_DISPLAY_ORDER,
  UPDATE_SECTION,
  UPDATE_SECTION_DISPLAY_ORDER,
} from '@island.is/form-system/graphql'
import { updateFormFn } from '../lib/utils/updateFormFn'
import { SectionTypes } from '@island.is/form-system/enums'
import { GoogleTranslation } from '@island.is/form-system/shared'

export const FormProvider: React.FC<{
  children: React.ReactNode
  formBuilder: FormSystemFormResponse
}> = ({ children, formBuilder }) => {
  const [focus, setFocus] = useState<string>('')
  const [inSettings, setInSettings] = useState(
    formBuilder?.form?.name?.is === '',
  )
  const [inListBuilder, setInListBuilder] = useState<boolean>(false)
  const [selectStatus, setSelectStatus] = useState<NavbarSelectStatus>(
    NavbarSelectStatus.OFF,
  )

  const {
    fieldTypes,
    listTypes,
    certificationTypes,
    applicantTypes,
    submitUrls,
    validationUrls,
    form,
  } = formBuilder
  const initialControl: ControlState = {
    activeItem: {
      type: 'Section',
      data: inSettings
        ? baseSettingsStep
        : removeTypename(form?.sections)?.find(
          (s: FormSystemSection) => s?.sectionType === SectionTypes.INPUT,
        ) ?? defaultStep,
    },
    activeListItem: null,
    form: removeTypename(form) as FormSystemForm,
    organizationNationalId: form?.organizationNationalId ?? '',
  }
  const [control, controlDispatch] = useReducer(controlReducer, initialControl)

  const updateSection = useMutation(UPDATE_SECTION)
  const updateScreen = useMutation(UPDATE_SCREEN)
  const updateField = useMutation(UPDATE_FIELD)
  const [updateSectionDisplayOrder] = useMutation(UPDATE_SECTION_DISPLAY_ORDER)
  const [updateScreenDisplayOrder] = useMutation(UPDATE_SCREEN_DISPLAY_ORDER)
  const [updateFieldDisplayOrder] = useMutation(UPDATE_FIELDS_DISPLAY_ORDER)
  const [updateForm] = useMutation(UPDATE_FORM)
  const [getGoogleTranslation] = useMutation(GET_GOOGLE_TRANSLATION)

  const getTranslation = async (text: string): Promise<GoogleTranslation> => {
    const result = await getGoogleTranslation({
      variables: {
        input: {
          q: text,
        },
      },
    })
    return (
      result.data?.formSystemGoogleTranslation ?? {
        translation: '',
      }
    )
  }

  const updateActiveItem = useCallback(
    (updatedActiveItem?: ActiveItem) =>
      updateActiveItemFn(
        control.activeItem,
        updateSection,
        updateScreen,
        updateField,
        updatedActiveItem,
      ),
    [control.activeItem, updateSection, updateScreen, updateField],
  )

  const updateDragAndDrop = useCallback(
    () =>
      updateDnd(
        control,
        updateSectionDisplayOrder,
        updateScreenDisplayOrder,
        updateFieldDisplayOrder,
      ),
    [
      control,
      updateSectionDisplayOrder,
      updateScreenDisplayOrder,
      updateFieldDisplayOrder,
    ],
  )

  const formUpdate = useCallback(
    (updatedForm?: FormSystemForm) => {
      return updateFormFn(control, updateForm, updatedForm)
    },
    [control, updateForm],
  )

  const context: IControlContext = useMemo(
    () => ({
      control,
      controlDispatch,
      certificationTypes,
      fieldTypes,
      listTypes,
      submitUrls,
      validationUrls,
      setInSettings,
      inSettings,
      updateActiveItem,
      focus,
      setFocus,
      updateDnD: updateDragAndDrop,
      selectStatus,
      setSelectStatus,
      setInListBuilder,
      inListBuilder,
      formUpdate,
      applicantTypes,
      getTranslation,
    }),
    [control, controlDispatch, inListBuilder, selectStatus],
  )

  return (
    <ControlContext.Provider value={context}>
      {children}
    </ControlContext.Provider>
  )
}
