import type {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
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

  if (!updates && action.type !== 'SET_FIELD_LIST') return fields

  return fields.map((field) => {
    if (field.id !== id) return field
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
