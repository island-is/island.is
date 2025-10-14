import { UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
  FormSystemField,
  FormSystemFieldSettings,
  FormSystemForm,
  FormSystemFormApplicant,
  FormSystemFormCertificationTypeDto,
  FormSystemLanguageType,
  FormSystemListItem,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { ActiveItem } from '../lib/utils/interfaces'
import { removeTypename } from '../lib/utils/removeTypename'

// TODO
// This is a very long reducer that is handling many responsibilities making it difficult to read and maintain. You can simplify it by splitting it into smaller more focused reducers.
// For example create sepeare reducers for
// ActiveItem
// Screen
// Field
// Section
// Dnd
// Form-level settings (form-wide settings like setting form name, validation and certification etc)
// InputSettings (field-specific settings like for file upload, add list item etc)

// And then combine into a main reducer that could be called "controlReducer"

type ActiveItemActions =
  | { type: 'SET_ACTIVE_ITEM'; payload: { activeItem: ActiveItem } }
  | {
      type: 'SET_ACTIVE_LIST_ITEM'
      payload: { listItem: FormSystemListItem | null }
    }

type ScreenActions =
  | {
      type: 'ADD_SCREEN'
      payload: { screen: FormSystemScreen; isApplicant?: boolean }
    }
  | { type: 'REMOVE_SCREEN'; payload: { id: string; isApplicant?: boolean } }

type FieldActions =
  | {
      type: 'ADD_FIELD'
      payload: { field: FormSystemField; isApplicant?: boolean }
    }
  | { type: 'REMOVE_FIELD'; payload: { id: string; isApplicant?: boolean } }
  | {
      type: 'CHANGE_FIELD_TYPE'
      payload: {
        newValue: string
        fieldSettings: FormSystemFieldSettings
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'CHANGE_DESCRIPTION'
      payload: { lang: 'en' | 'is'; newValue: string }
    }
  | {
      type: 'CHANGE_IS_REQUIRED'
      payload: { update: (updatedActiveItem?: ActiveItem) => void }
    }

type SectionActions =
  | { type: 'ADD_SECTION'; payload: { section: FormSystemSection } }
  | { type: 'REMOVE_SECTION'; payload: { id: string } }

type DndActions =
  | {
      type: 'SECTION_OVER_SECTION'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'SCREEN_OVER_SECTION'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'SCREEN_OVER_SCREEN'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'FIELD_OVER_SCREEN'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'FIELD_OVER_FIELD'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'LIST_ITEM_OVER_LIST_ITEM'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'REMOVE_DEPENDENCIES'
      payload: {
        activeId: UniqueIdentifier
        update: (updatedForm: FormSystemForm) => void
      }
    }

type ChangeActions =
  | {
      type: 'CHANGE_APPLICANT_NAME'
      payload: { lang: 'en' | 'is'; newValue: string; id: string }
    }
  | { type: 'CHANGE_NAME'; payload: { lang: 'en' | 'is'; newValue: string } }
  | {
      type: 'CHANGE_FORM_NAME'
      payload: { lang: 'en' | 'is'; newValue: string }
    }
  | {
      type: 'CHANGE_ORGANIZATION_DISPLAY_NAME'
      payload: { lang: 'en' | 'is'; newValue: string }
    }
  | {
      type: 'CHANGE_ORGANIZATION_NATIONAL_ID'
      payload: { newValue: string }
    }
  | {
      type: 'CHANGE_SLUG'
      payload: { newValue: string }
    }
  | { type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE'; payload: { value: number } }
  | { type: 'CHANGE_INVALIDATION_DATE'; payload: { value: Date } }
  | {
      type: 'CHANGE_ALLOW_PROCEED_ON_VALIDATION_FAIL'
      payload: { value: boolean; update: (updatedForm: FormSystemForm) => void }
    }
  | {
      type: 'CHANGE_HAS_SUMMARY_SCREEN'
      payload: { value: boolean; update: (updatedForm: FormSystemForm) => void }
    }
  | {
      type: 'CHANGE_HAS_PAYMENT'
      payload: { value: boolean; update: (updatedForm: FormSystemForm) => void }
    }
  | { type: 'CHANGE_FORM_SETTINGS'; payload: { newForm: FormSystemForm } }
  | {
      type: 'TOGGLE_DEPENDENCY'
      payload: {
        activeId: string
        itemId: string
        update: (updatedForm: FormSystemForm) => void
      }
    }
  | {
      type: 'TOGGLE_MULTI_SET'
      payload: {
        checked: boolean
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'CHANGE_CERTIFICATION'
      payload: {
        certificate: FormSystemFormCertificationTypeDto
        checked: boolean
      }
    }
  | {
      type: 'UPDATE_APPLICANT_TYPES'
      payload: { newValue: FormSystemFormApplicant[] }
    }
  | {
      type: 'UPDATE_FORM_URLS'
      payload: { newValue: string[] }
    }

type InputSettingsActions =
  | {
      type: 'SET_MESSAGE_WITH_LINK_SETTINGS'
      payload: {
        property: 'buttonText' | 'url' | 'hasLink'
        value?: string
        checked?: boolean
        lang?: 'is' | 'en'
        update?: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_FILE_UPLOAD_SETTINGS'
      payload: {
        property: 'isMulti' | 'fileMaxSize' | 'maxFiles' | 'fileTypes'
        checked?: boolean
        value?: string | number
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_FIELD_SETTINGS'
      payload: {
        property: 'isLarge'
        value: boolean
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_ZENDESK_FIELD_SETTINGS'
      payload: {
        property:
          | 'zendeskIsPrivate'
          | 'zendeskIsCustomField'
          | 'zendeskCustomFieldId'
        value: boolean | string
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_IS_ZENDESK_ENABLED'
      payload: {
        value: boolean
      }
    }
  | {
      type: 'SET_LIST_ITEM_SELECTED'
      payload: {
        id: UniqueIdentifier
      }
    }
  | {
      type: 'REMOVE_LIST_ITEM'
      payload: {
        id: UniqueIdentifier
      }
    }
  | {
      type: 'CHANGE_LIST_ITEM'
      payload: {
        property: 'label' | 'description'
        lang: 'is' | 'en'
        value: string
        id: UniqueIdentifier
      }
    }
  | { type: 'ADD_LIST_ITEM'; payload: { newListItem: FormSystemListItem } }
  | {
      type: 'SET_LIST_TYPE'
      payload: {
        listType: string
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_COMPLETED_TITLE'
      payload: {
        lang: 'is' | 'en'
        newValue: string
      }
    }
  | {
      type: 'SET_COMPLETED_CONFIRMATION_HEADER'
      payload: {
        lang: 'is' | 'en'
        newValue: string
      }
    }
  | {
      type: 'SET_COMPLETED_TEXT'
      payload: {
        lang: 'is' | 'en'
        newValue: string
      }
    }
  | {
      type: 'SET_COMPLETED_ADDITIONAL_INFO'
      payload: {
        newValue: FormSystemLanguageType[]
        update: (updatedForm: FormSystemForm) => void
      }
    }

export type ControlAction =
  | ActiveItemActions
  | ScreenActions
  | FieldActions
  | SectionActions
  | DndActions
  | ChangeActions
  | InputSettingsActions

export interface ControlState {
  activeItem: ActiveItem
  activeListItem: FormSystemListItem | null
  form: FormSystemForm
  organizationNationalId: string | null
}

export const controlReducer = (
  state: ControlState,
  action: ControlAction,
): ControlState => {
  const { form, activeItem } = state
  const { sections, screens, fields } = form
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.payload.activeItem,
      }
    case 'SET_ACTIVE_LIST_ITEM': {
      return {
        ...state,
        activeListItem: action.payload.listItem,
      }
    }
    // Sections
    case 'ADD_SECTION': {
      const newSection = {
        ...action.payload.section,
        displayOrder: sections?.length ?? 0,
        sectionType: SectionTypes.INPUT,
      }
      return {
        ...state,
        activeItem: {
          type: 'Section',
          data: newSection,
        },
        form: {
          ...form,
          sections: [...(sections || []), newSection],
        },
      }
    }
    case 'REMOVE_SECTION': {
      const newSections = state.form.sections?.filter(
        (section) => section?.id !== action.payload.id,
      )
      return {
        ...state,
        form: {
          ...form,
          sections: newSections,
        },
      }
    }

    // Screens
    case 'ADD_SCREEN': {
      if (action.payload.isApplicant) {
        return {
          ...state,
          form: {
            ...form,
            screens: [...(screens || []), action.payload.screen],
          },
        }
      }
      return {
        ...state,
        activeItem: {
          type: 'Screen',
          data: action.payload.screen,
        },
        form: {
          ...form,
          screens: [...(screens || []), action.payload.screen],
        },
      }
    }
    case 'REMOVE_SCREEN': {
      const newScreens = state.form.screens?.filter(
        (screen) => screen?.id !== action.payload.id,
      )
      if (action.payload.isApplicant) {
        return {
          ...state,
          form: {
            ...form,
            screens: newScreens,
          },
        }
      }
      const currentItem = state.activeItem.data as FormSystemScreen
      const newActiveItem = state.form.sections?.find(
        (section) => section?.id === currentItem.sectionId,
      )
      return {
        ...state,
        activeItem: {
          type: 'Section',
          data: newActiveItem,
        },
        form: {
          ...form,
          screens: newScreens,
        },
      }
    }

    // Fields
    case 'ADD_FIELD': {
      if (action.payload.isApplicant) {
        return {
          ...state,
          form: {
            ...form,
            fields: [...(fields || []), action.payload.field],
          },
        }
      }
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: action.payload.field,
        },
        form: {
          ...form,
          fields: [...(fields || []), action.payload.field],
        },
      }
    }
    case 'REMOVE_FIELD': {
      const newFields = state.form.fields?.filter(
        (field) => field?.id !== action.payload.id,
      )
      if (action.payload.isApplicant) {
        return {
          ...state,
          form: {
            ...form,
            fields: newFields,
          },
        }
      }
      const currentItem = state.activeItem.data as FormSystemField
      const newActiveItem = state.form.screens?.find(
        (screen) => screen?.id === currentItem.screenId,
      )
      return {
        ...state,
        activeItem: {
          type: 'Screen',
          data: newActiveItem,
        },
        form: {
          ...form,
          fields: newFields,
        },
      }
    }
    case 'CHANGE_FIELD_TYPE': {
      const { newValue, fieldSettings, update } = action.payload
      const currentData = activeItem.data as FormSystemField
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          fieldType: newValue,
          fieldSettings: removeTypename(fieldSettings),
        },
      }
      update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          fields: fields?.map((f) =>
            f?.id === activeItem.data?.id ? newActive.data : f,
          ),
        },
      }
    }
    case 'CHANGE_DESCRIPTION': {
      const { lang, newValue } = action.payload
      const currentData = activeItem.data as FormSystemField
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          description: {
            ...currentData?.description,
            [lang]: newValue,
          },
        },
      }
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === currentData?.id ? newActive.data : i,
          ),
        },
      }
    }

    case 'CHANGE_IS_REQUIRED': {
      const currentData = activeItem.data as FormSystemField
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          isRequired: !currentData?.isRequired,
        },
      }
      action.payload.update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === currentData?.id ? newActive.data : i,
          ),
        },
      }
    }

    // Change
    case 'CHANGE_APPLICANT_NAME': {
      const { lang, newValue, id } = action.payload
      const nextFields = (state.form.fields ?? [])
        .filter((f): f is FormSystemField => !!f && typeof f.id === 'string')
        .map((f) =>
          f.id === id
            ? {
                ...f,
                name: {
                  ...(f.name ?? {}),
                  [lang]: newValue,
                },
              }
            : f,
        )

      return {
        ...state,
        form: {
          ...state.form,
          fields: nextFields,
        },
      }
    }

    case 'CHANGE_NAME': {
      const { lang, newValue } = action.payload
      let newData
      if (activeItem.type === 'Section') {
        newData = {
          ...(activeItem.data as FormSystemSection),
          name: {
            ...(activeItem.data as FormSystemSection).name,
            [lang]: newValue,
          },
        }
      } else if (activeItem.type === 'Screen') {
        newData = {
          ...(activeItem.data as FormSystemScreen),
          name: {
            ...(activeItem.data as FormSystemScreen).name,
            [lang]: newValue,
          },
        }
      } else if (activeItem.type === 'Field') {
        newData = {
          ...(activeItem.data as FormSystemField),
          name: {
            ...(activeItem.data as FormSystemField).name,
            [lang]: newValue,
          },
        }
      } else {
        newData = activeItem.data
      }
      const newActive = {
        ...activeItem,
        data: newData,
      }
      const { type } = activeItem
      let updatedList
      if (type === 'Section') {
        updatedList = sections?.map((s) =>
          s?.id === activeItem.data?.id ? newActive.data : s,
        )
      } else if (type === 'Screen') {
        updatedList = screens?.map((g) =>
          g?.id === activeItem.data?.id ? newActive.data : g,
        )
      } else if (type === 'Field') {
        updatedList = fields?.map((i) =>
          i?.id === activeItem.data?.id ? newActive.data : i,
        )
      }
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          sections:
            type === 'Section'
              ? (updatedList as FormSystemSection[])
              : form.sections,
          screens:
            type === 'Screen'
              ? (updatedList as FormSystemScreen[])
              : form.screens,
          fields:
            type === 'Field' ? (updatedList as FormSystemField[]) : form.fields,
        },
      }
    }
    case 'CHANGE_FORM_NAME': {
      const { lang, newValue } = action.payload
      return {
        ...state,
        form: {
          ...form,
          name: {
            ...form.name,
            [lang]: newValue,
          },
        },
      }
    }
    case 'CHANGE_ORGANIZATION_DISPLAY_NAME': {
      const { lang, newValue } = action.payload
      return {
        ...state,
        form: {
          ...form,
          organizationDisplayName: {
            ...form.organizationDisplayName,
            [lang]: newValue,
          },
        },
      }
    }
    case 'CHANGE_ORGANIZATION_NATIONAL_ID': {
      return {
        ...state,
        organizationNationalId: action.payload.newValue,
      }
    }
    case 'CHANGE_SLUG': {
      return {
        ...state,
        form: {
          ...form,
          slug: action.payload.newValue,
        },
      }
    }
    case 'CHANGE_APPLICATION_DAYS_TO_REMOVE': {
      return {
        ...state,
        form: {
          ...form,
          applicationDaysToRemove: action.payload.value,
        },
      }
    }
    case 'CHANGE_INVALIDATION_DATE': {
      return {
        ...state,
        form: {
          ...form,
          invalidationDate: action.payload.value,
        },
      }
    }
    case 'CHANGE_FORM_SETTINGS': {
      return {
        ...state,
        form: action.payload.newForm,
      }
    }
    case 'CHANGE_ALLOW_PROCEED_ON_VALIDATION_FAIL': {
      const updatedState = {
        ...state,
        form: {
          ...form,
          allowProceedOnValidationFail: action.payload.value,
        },
      }
      action.payload.update({ ...updatedState.form })
      return updatedState
    }
    case 'CHANGE_HAS_SUMMARY_SCREEN': {
      const updatedState = {
        ...state,
        form: {
          ...form,
          hasSummaryScreen: action.payload.value,
        },
      }
      action.payload.update({ ...updatedState.form })
      return updatedState
    }
    case 'CHANGE_HAS_PAYMENT': {
      const updatedState = {
        ...state,
        form: {
          ...form,
          hasPayment: action.payload.value,
        },
      }
      action.payload.update({ ...updatedState.form })
      return updatedState
    }
    case 'UPDATE_APPLICANT_TYPES': {
      return {
        ...state,
        form: {
          ...form,
          applicantTypes: action.payload.newValue,
        },
      }
    }
    case 'UPDATE_FORM_URLS': {
      return {
        ...state,
        form: {
          ...form,
          urls: action.payload.newValue,
        },
      }
    }

    // Check whether dependencies has a dependency object with activeId in parentProp
    // If it does, check if the childProps array contains the itemId
    // If it does, remove it, if it doesn't, add it
    // If parent exists and child doesn't, add it
    // If parent exists and child exists, remove it from the array and also remove the dependency object if the array is empty
    case 'TOGGLE_DEPENDENCY': {
      const { activeId, itemId, update } = action.payload
      const dependency = form.dependencies?.find(
        (dep) => dep?.parentProp === activeId,
      )
      const parentExists = dependency !== undefined
      const childExists = dependency?.childProps?.includes(itemId) ?? false
      let updatedDependencies = form.dependencies ?? []
      if (parentExists) {
        if (childExists) {
          const updatedChildProps = dependency?.childProps?.filter(
            (child) => child !== itemId,
          )
          if ((updatedChildProps?.length ?? 0) > 0) {
            updatedDependencies = updatedDependencies.map((dep) =>
              dep?.parentProp === activeId
                ? { ...dep, childProps: updatedChildProps }
                : dep,
            )
          } else {
            updatedDependencies = updatedDependencies.filter(
              (dep) => dep?.parentProp !== activeId,
            )
          }
        } else {
          updatedDependencies = updatedDependencies.map((dep) =>
            dep?.parentProp === activeId
              ? { ...dep, childProps: [...(dep.childProps ?? []), itemId] }
              : dep,
          )
        }
      } else {
        updatedDependencies = [
          ...updatedDependencies,
          { parentProp: activeId, childProps: [itemId], isSelected: false },
        ]
      }
      const updatedForm = {
        ...form,
        dependencies: updatedDependencies,
      }
      update(updatedForm)
      return {
        ...state,
        form: updatedForm,
      }
    }

    case 'TOGGLE_MULTI_SET': {
      const currentData = activeItem.data as FormSystemScreen
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          multiset: action.payload.checked ? 1 : 0,
        },
      }
      action.payload.update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          screens: screens?.map((g) =>
            g?.id === currentData?.id ? newActive.data : g,
          ),
        },
      }
    }

    case 'CHANGE_CERTIFICATION': {
      const { certificate, checked } = action.payload
      const updatedCertifications = checked
        ? [...(form.certificationTypes ?? []), certificate]
        : form.certificationTypes?.filter((c) => c?.id !== certificate.id)
      return {
        ...state,
        form: {
          ...form,
          certificationTypes: updatedCertifications,
        },
      }
    }
    // Input settings
    case 'SET_MESSAGE_WITH_LINK_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, lang: langg, value, checked, update } = action.payload
      const lang = langg ?? 'is'

      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          [property]: property === 'hasLink' ? checked : value,
          ...(property === 'buttonText'
            ? {
                buttonText: {
                  ...field.fieldSettings?.buttonText,
                  [lang]: value,
                },
              }
            : {}),
        },
      }
      if (property === 'hasLink' && update) {
        update({ type: 'Field', data: newField })
      }
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'SET_FILE_UPLOAD_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, checked, value, update } = action.payload

      const updateFileTypesArray = (): string => {
        const newFileTypes = field.fieldSettings?.fileTypes?.split(',') ?? []
        if (checked) {
          return [...newFileTypes, value as string].toString()
        } else {
          return newFileTypes.filter((type) => type !== value).toString()
        }
      }
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          [property]:
            property === 'fileTypes'
              ? updateFileTypesArray()
              : property === 'isMulti'
              ? checked
              : value,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'SET_FIELD_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, value, update } = action.payload
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          [property]: value,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'SET_ZENDESK_FIELD_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, value, update } = action.payload
      const newField = {
        ...field,
        fieldSettings: {
          ...removeTypename(field.fieldSettings),
          [property]: value,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'SET_IS_ZENDESK_ENABLED': {
      const { value } = action.payload
      return {
        ...state,
        form: {
          ...form,
          isZendeskEnabled: value,
        },
      }
    }
    case 'SET_LIST_ITEM_SELECTED': {
      const { id } = action.payload
      const field = activeItem.data as FormSystemField
      const list = field.list ?? []
      const newField = {
        ...field,
        list: list
          .filter((l): l is FormSystemListItem => l !== null && l !== undefined)
          .map((l: FormSystemListItem) =>
            l.id === id
              ? { ...l, isSelected: !l.isSelected }
              : { ...l, isSelected: false },
          ),
      }

      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'REMOVE_LIST_ITEM': {
      const { id } = action.payload
      const field = activeItem.data as FormSystemField
      const list = field.list ?? []
      const newField = {
        ...field,
        list: list.filter(
          (l: FormSystemListItem | null | undefined): l is FormSystemListItem =>
            l !== null && l !== undefined && l.id !== id,
        ),
      }
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }

    case 'ADD_LIST_ITEM': {
      const field = activeItem.data as FormSystemField
      const newField = {
        ...field,
        list: [...(field?.list ?? []), action.payload.newListItem],
      }

      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'CHANGE_LIST_ITEM': {
      const field = activeItem.data as FormSystemField
      const list = field.list as FormSystemListItem[]
      const { property, lang, value, id } = action.payload
      const listItem = list?.find((l) => l?.id === id) as FormSystemListItem

      const newListItem = {
        ...listItem,
        [property]: {
          ...listItem[property],
          [lang]: value,
        },
      }

      const newField = {
        ...field,
        list: list
          .filter((l) => l !== null)
          .map((l: FormSystemListItem) => {
            if (l.id === id) {
              return newListItem
            }
            return l
          }),
      }

      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) => (i?.id === field.id ? newField : i)),
        },
      }
    }
    case 'SET_LIST_TYPE': {
      const field = activeItem.data as FormSystemField
      const { listType, update } = action.payload
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          listType: listType,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((f) => (f?.id === field.id ? newField : f)),
        },
      }
    }
    // Drag and Drop
    case 'SECTION_OVER_SECTION': {
      const activeIndex = sections?.findIndex(
        (section) => section?.id === action.payload.activeId,
      ) as number
      const overIndex = sections?.findIndex(
        (section) => section?.id === action.payload.overId,
      ) as number
      const updatedSections = arrayMove(sections || [], activeIndex, overIndex)
      return {
        ...state,
        form: {
          ...form,
          sections: updatedSections,
        },
      }
    }
    case 'SCREEN_OVER_SECTION': {
      const activeIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.activeId,
      ) as number
      const overIndex = sections?.findIndex(
        (section) => section?.id === action.payload.overId,
      ) as number
      const updatedScreens = screens as FormSystemScreen[]
      if (sections && sections[overIndex]) {
        updatedScreens[activeIndex].sectionId = action.payload.overId as string
      }
      return {
        ...state,
        form: {
          ...form,
          screens: arrayMove(updatedScreens, activeIndex, activeIndex),
        },
      }
    }
    case 'SCREEN_OVER_SCREEN': {
      const activeIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.activeId,
      ) as number
      const overIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.overId,
      ) as number
      const updatedScreens = screens as FormSystemScreen[]
      if (updatedScreens[activeIndex] && updatedScreens[overIndex]) {
        if (
          updatedScreens[activeIndex].sectionId !==
          updatedScreens[overIndex].sectionId
        ) {
          updatedScreens[activeIndex].sectionId =
            updatedScreens[overIndex].sectionId
          return {
            ...state,
            form: {
              ...form,
              screens: arrayMove(updatedScreens, activeIndex, overIndex - 1),
            },
          }
        }
        return {
          ...state,
          form: {
            ...form,
            screens: arrayMove(updatedScreens, activeIndex, overIndex),
          },
        }
      }
      return state
    }
    case 'FIELD_OVER_SCREEN': {
      const activeIndex = fields?.findIndex(
        (field) => field?.id === action.payload.activeId,
      ) as number
      const overIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.overId,
      ) as number
      const updatedFields = fields?.map((input) => ({
        ...input,
      })) as FormSystemField[]
      if (screens && screens[overIndex]) {
        updatedFields[activeIndex].screenId = action.payload.overId as string
      }
      return {
        ...state,
        form: {
          ...form,
          fields: arrayMove(updatedFields, activeIndex, overIndex),
        },
      }
    }
    case 'FIELD_OVER_FIELD': {
      const activeIndex = fields?.findIndex(
        (field) => field?.id === action.payload.activeId,
      ) as number
      const overIndex = fields?.findIndex(
        (field) => field?.id === action.payload.overId,
      ) as number
      const updatedFields = fields as FormSystemField[]
      if (updatedFields[activeIndex] && updatedFields[overIndex]) {
        if (
          updatedFields[activeIndex].screenId !==
          updatedFields[overIndex].screenId
        ) {
          updatedFields[activeIndex].screenId =
            updatedFields[overIndex].screenId
          return {
            ...state,
            form: {
              ...form,
              fields: arrayMove(updatedFields, activeIndex, overIndex - 1),
            },
          }
        }
        return {
          ...state,
          form: {
            ...form,
            fields: arrayMove(updatedFields, activeIndex, overIndex),
          },
        }
      }
      return state
    }
    case 'LIST_ITEM_OVER_LIST_ITEM': {
      const fieldItem = activeItem.data as FormSystemField
      const list = fieldItem.list as FormSystemListItem[]
      const { activeId, overId } = action.payload
      if (!list) {
        return state
      }
      const activeIndex = list.findIndex(
        (listItem) => listItem?.id === activeId,
      )
      const overIndex = list.findIndex((listItem) => listItem?.id === overId)

      const newField: FormSystemField = {
        ...fieldItem,
        list: arrayMove<FormSystemListItem>(list, activeIndex, overIndex).map(
          (l: FormSystemListItem, i: number) => ({ ...l, displayOrder: i }),
        ),
      }
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((field) =>
            field?.id === fieldItem.id ? newField : field,
          ),
        },
      }
    }
    case 'REMOVE_DEPENDENCIES': {
      const { activeId, update } = action.payload
      const id = String(activeId)
      const source = (form.dependencies ?? []).filter(
        (dep) => dep !== null && dep !== undefined,
      ) as NonNullable<typeof form.dependencies>

      const updatedDependencies = source
        .filter((dep) => dep?.parentProp !== id)
        .map((dep) => ({
          ...dep,
          childProps: dep?.childProps?.filter((child) => child !== id),
        }))
        .filter((dep) => (dep.childProps?.length ?? 0) > 0)

      const updatedForm = {
        ...form,
        dependencies: updatedDependencies,
      }
      update(updatedForm)
      return { ...state, form: updatedForm }
    }
    case 'SET_COMPLETED_TITLE': {
      const { lang, newValue } = action.payload
      const updatedForm = {
        ...form,
        completedSectionInfo: {
          ...(form.completedSectionInfo ?? {}),
          title: {
            ...(form.completedSectionInfo?.title ?? { is: '', en: '' }),
            [lang]: newValue,
          },
          confirmationHeader: form.completedSectionInfo?.confirmationHeader ?? {
            is: '',
            en: '',
          },
          confirmationText: form.completedSectionInfo?.confirmationText ?? {
            is: '',
            en: '',
          },
          additionalInfo: form.completedSectionInfo?.additionalInfo ?? [],
        },
      }
      return {
        ...state,
        form: updatedForm,
      }
    }
    case 'SET_COMPLETED_TEXT': {
      const { lang, newValue } = action.payload
      return {
        ...state,
        form: {
          ...form,
          completedSectionInfo: {
            ...(form.completedSectionInfo ?? {}),
            title: form.completedSectionInfo?.title ?? { is: '', en: '' },
            confirmationHeader: form.completedSectionInfo
              ?.confirmationHeader ?? {
              is: '',
              en: '',
            },
            confirmationText: {
              ...(form.completedSectionInfo?.confirmationText ?? {
                is: '',
                en: '',
              }),
              [lang]: newValue,
            },
            additionalInfo: form.completedSectionInfo?.additionalInfo ?? [],
          },
        },
      }
    }
    case 'SET_COMPLETED_CONFIRMATION_HEADER': {
      const { lang, newValue } = action.payload
      return {
        ...state,
        form: {
          ...form,
          completedSectionInfo: {
            ...(form.completedSectionInfo ?? {}),
            title: form.completedSectionInfo?.title ?? { is: '', en: '' },
            confirmationHeader: {
              ...(form.completedSectionInfo?.confirmationHeader ?? {
                is: '',
                en: '',
              }),
              [lang]: newValue,
            },
            confirmationText: form.completedSectionInfo?.confirmationText ?? {
              is: '',
              en: '',
            },
            additionalInfo: form.completedSectionInfo?.additionalInfo ?? [],
          },
        },
      }
    }
    case 'SET_COMPLETED_ADDITIONAL_INFO': {
      const newForm = {
        ...form,
        completedSectionInfo: {
          ...(form.completedSectionInfo ?? {}),
          title: form.completedSectionInfo?.title ?? { is: '', en: '' },
          confirmationHeader: form.completedSectionInfo?.confirmationHeader ?? {
            is: '',
            en: '',
          },
          confirmationText: form.completedSectionInfo?.confirmationText ?? {
            is: '',
            en: '',
          },
          additionalInfo: action.payload.newValue,
        },
      }
      action.payload.update(newForm)
      return {
        ...state,
        form: newForm,
      }
    }
    default:
      return state
  }
}
