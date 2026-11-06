import type {
  FormSystemDependency,
  FormSystemField,
  FormSystemForm,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import type { Action } from '@island.is/form-system/ui'

const valueKeys: Record<string, string> = {
  SET_BANK_ACCOUNT: 'bankAccount',
  SET_CHECKBOX_VALUE: 'checkboxValue',
  SET_CURRENCY: 'iskNumber',
  SET_EMAIL: 'email',
  SET_NATIONAL_ID: 'nationalId',
  SET_PHONE_NUMBER: 'phoneNumber',
  SET_TEXT: 'text',
  SET_NUMBER: 'number',
  SET_DATE: 'date',
  SET_TIME: 'time',
  SET_NAME: 'name',
  SET_MARITAL_STATUS: 'maritalStatus',
  SET_FILES: 's3Key',
  SET_PAYMENT_QUANTITY: 'number',
}

export const updatePreviewFields = (
  fields: FormSystemField[],
  action: Action,
): FormSystemField[] => {
  const { id, value, valueIndex = 0, ...details } = action.payload ?? {}
  const valueKey = valueKeys[action.type]
  const updates = valueKey
    ? { [valueKey]: value }
    : action.type === 'SET_LIST_VALUE'
    ? { label: value?.label, value: value?.value }
    : action.type === 'SET_ASSET_VALUE' || action.type === 'SET_ADDRESS'
    ? details
    : undefined

  if (
    !updates &&
    action.type !== 'SET_FIELD_LIST' &&
    action.type !== 'REMOVE_MULTISET_ITEM'
  )
    return fields

  return fields.map((field) => {
    if (field.id !== id) return field
    if (action.type === 'REMOVE_MULTISET_ITEM') {
      if (
        field.isPartOfMultiset === false ||
        valueIndex < 1 ||
        valueIndex >= (field.values?.length ?? 0)
      )
        return field
      return {
        ...field,
        values: field.values?.filter((_, index) => index !== valueIndex),
      }
    }
    if (action.type === 'SET_FIELD_LIST') {
      return { ...field, list: details.list }
    }
    const values = [...(field.values ?? [])]
    const previousValue = values[valueIndex]
    const json = { ...previousValue?.json, ...updates }
    if (JSON.stringify(previousValue?.json) === JSON.stringify(json)) {
      return field
    }
    values[valueIndex] = { ...previousValue, json }
    return { ...field, values }
  })
}

interface PreviewStep {
  section: FormSystemSection
  sectionIndex: number
  screen?: FormSystemScreen
}

export interface PreviewState {
  fields: FormSystemField[]
  dependencies: FormSystemDependency[]
  sections: FormSystemSection[]
}

export const createPreviewState = (form: FormSystemForm): PreviewState => ({
  fields: (form.fields ?? []).filter(
    (field): field is FormSystemField => !!field,
  ),
  dependencies: (form.dependencies ?? []).filter(
    (dependency): dependency is FormSystemDependency => !!dependency,
  ),
  sections: (form.sections ?? [])
    .filter((section): section is FormSystemSection => !!section)
    .map((section) => ({
      ...section,
      screens: (form.screens ?? []).filter(
        (screen): screen is FormSystemScreen =>
          !!screen && screen.sectionId === section.id,
      ),
    })),
})

export const getPreviewSections = (
  state: PreviewState,
  enforceRestrictions: boolean,
): FormSystemSection[] => {
  const isHidden = (id: string | null | undefined) => {
    const dependencies = state.dependencies.filter((dependency) =>
      id ? dependency.childProps?.includes(id) : false,
    )
    return (
      dependencies.length > 0 &&
      !dependencies.some((dependency) => dependency.isSelected)
    )
  }

  return state.sections.map((section) => {
    const applyDependencies =
      enforceRestrictions &&
      section.sectionType !== SectionTypes.PARTIES &&
      section.sectionType !== SectionTypes.SUMMARY
    const sectionHidden = applyDependencies
      ? isHidden(section.id)
      : section.isHidden
    return {
      ...section,
      isHidden: sectionHidden,
      screens: section.screens?.map((screen) => {
        if (!screen) return screen
        const screenHidden = applyDependencies
          ? sectionHidden || isHidden(screen.id)
          : screen.isHidden
        return {
          ...screen,
          isHidden: screenHidden,
          fields: state.fields
            .filter((field) => field.screenId === screen.id)
            .map((field) => ({
              ...field,
              isHidden: applyDependencies
                ? screenHidden || isHidden(field.id)
                : field.isHidden,
            })),
        }
      }),
    }
  })
}

export const updateRestrictedPreview = (
  state: PreviewState,
  action: Action,
): PreviewState => {
  let fields = updatePreviewFields(state.fields, action)
  let dependencies = state.dependencies
  let changed = true

  while (changed) {
    dependencies = dependencies.map((dependency) => {
      const controller = fields.find((field) =>
        field.fieldType === FieldTypesEnum.CHECKBOX
          ? field.id === dependency.parentProp
          : (field.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
              field.fieldType === FieldTypesEnum.DROPDOWN_LIST) &&
            field.list?.some((option) => option?.id === dependency.parentProp),
      )
      if (!controller) return dependency
      const option = controller.list?.find(
        (item) => item?.id === dependency.parentProp,
      )
      const isSelected =
        controller.values?.some((value) =>
          controller.fieldType === FieldTypesEnum.CHECKBOX
            ? value?.json?.checkboxValue === true
            : !!option &&
              !!value?.json?.label &&
              value.json.label.is === option.label?.is,
        ) ?? false
      return { ...dependency, isSelected }
    })

    const visibleFields = getPreviewSections(
      { ...state, fields, dependencies },
      true,
    )
      .flatMap((section) => section.screens ?? [])
      .flatMap((screen) => screen?.fields ?? [])
    changed = false
    fields = fields.map((field) => {
      const isController =
        field.fieldType === FieldTypesEnum.CHECKBOX ||
        field.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
        field.fieldType === FieldTypesEnum.DROPDOWN_LIST
      if (
        !isController ||
        !visibleFields.find((item) => item?.id === field.id)?.isHidden
      ) {
        return field
      }
      const values = field.values?.map((value) =>
        value
          ? {
              ...value,
              json: {
                ...value.json,
                ...(field.fieldType === FieldTypesEnum.CHECKBOX
                  ? { checkboxValue: false }
                  : { label: null, value: null }),
              },
            }
          : value,
      )
      if (JSON.stringify(values) === JSON.stringify(field.values)) return field
      changed = true
      return { ...field, values }
    })
  }
  return { ...state, fields, dependencies }
}

export const getRestrictedPreviewStart = (steps: PreviewStep[]): number => {
  const applicantsIndex = steps.reduce(
    (lastIndex, step, index) =>
      step.section.sectionType === SectionTypes.PARTIES ? index : lastIndex,
    -1,
  )
  const firstInput = steps.findIndex(
    (step, index) =>
      index > applicantsIndex &&
      step.section.sectionType === SectionTypes.INPUT &&
      !!step.screen,
  )
  return Math.max(0, firstInput)
}

export const getPreviewSteps = (sections: FormSystemSection[]): PreviewStep[] =>
  sections.flatMap<PreviewStep>((section, sectionIndex) => {
    if (section.isHidden || section.sectionType === SectionTypes.PAYMENT) {
      return []
    }
    const screens = (section.screens ?? []).filter(
      (screen): screen is FormSystemScreen => !!screen && !screen.isHidden,
    )
    return screens.length > 0
      ? screens.map((screen) => ({ section, sectionIndex, screen }))
      : [{ section, sectionIndex, screen: undefined }]
  })
