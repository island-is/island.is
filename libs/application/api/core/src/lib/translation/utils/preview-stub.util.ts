import type {
  Application,
  CheckboxField,
  ExternalData,
  Field,
  FormValue,
  Option,
  OverviewField,
  RadioField,
  StaticText,
  SubmitField,
} from '@island.is/application/types'
import type {
  MessageDescriptorInfo,
  RadioOptionIntrospection,
  SubmitActionIntrospection,
} from '@island.is/application/types'
import type { BffUser, Locale } from '@island.is/shared/types'
import {
  addDescriptorIfNew,
  extractDescriptorsFromKeyValueItem,
  extractStaticText,
  isMessageDescriptor,
  extractMessageDescriptorsFromFormText,
} from './message-descriptor.util'

export const stubApplicationForOptionPreview = (): Application => {
  return {
    answers: {},
    externalData: {},
    id: '',
    state: '',
    typeId: '',
    applicant: '',
    assignees: [],
    applicantActors: [],
    modified: new Date(),
    created: new Date(),
    attachments: {},
    status: 'draft',
  } as unknown as Application
}

export const stubUserForIdPreview = (): BffUser => {
  const nationalId = '0000000000'
  return {
    nationalId,
    profile: { nationalId },
  } as unknown as BffUser
}

export const extractStaticId = (id: unknown): string => {
  if (id === undefined || id === null) return ''
  if (typeof id === 'string') return id
  if (typeof id === 'function') {
    try {
      const stubApp = stubApplicationForOptionPreview()
      const stubUser = stubUserForIdPreview()
      const result = (
        id as (application: Application, user: BffUser) => string
      )(stubApp, stubUser)
      return typeof result === 'string' ? result : '[dynamic]'
    } catch {
      return '[dynamic]'
    }
  }
  return String(id)
}

/**
 * Evaluate `MaybeWithApplicationAndFieldAndLocale<Option[]>` so radio/checkbox previews
 * can show labels when templates pass option factories (e.g. `getOtherFeesPayeeOptions`).
 */
export const tryResolveOptionsArrayForPreview = (
  options: RadioField['options'] | CheckboxField['options'],
  fieldContext: RadioField | CheckboxField,
): Option[] | undefined => {
  if (Array.isArray(options)) {
    return options
  }
  if (typeof options !== 'function') {
    return undefined
  }
  const stubApp = stubApplicationForOptionPreview()
  const locales: Locale[] = ['is', 'en']
  for (const locale of locales) {
    try {
      const result = (
        options as (
          application: Application,
          field: Field,
          locale: Locale,
        ) => Option[]
      )(stubApp, fieldContext, locale)
      if (Array.isArray(result)) {
        return result
      }
    } catch {
      // Factory may require real answers; try next locale or give up.
    }
  }
  return undefined
}

export const extractFieldOptionsForPreview = (
  options: RadioField['options'] | CheckboxField['options'],
  fieldContext: RadioField | CheckboxField,
): RadioOptionIntrospection[] | undefined => {
  const raw = tryResolveOptionsArrayForPreview(options, fieldContext)
  if (!raw) {
    return undefined
  }
  return raw.map((option) => {
    const label = option.label
    if (isMessageDescriptor(label)) {
      return {
        value: option.value,
        labelMessageId: String(label.id),
        labelDefaultMessage:
          (label.defaultMessage as string | undefined) ?? null,
      }
    }
    if (typeof label === 'function') {
      return {
        value: option.value,
        labelDefaultMessage: option.value,
      }
    }
    if (typeof label === 'string') {
      return { value: option.value, labelDefaultMessage: label }
    }
    return {
      value: option.value,
      labelDefaultMessage: extractStaticText(label as StaticText),
    }
  })
}

export const extractRadioPreviewOptions = (
  field: RadioField,
): RadioOptionIntrospection[] | undefined => {
  return extractFieldOptionsForPreview(field.options, field)
}

export const extractCheckboxPreviewOptions = (
  field: CheckboxField,
): RadioOptionIntrospection[] | undefined => {
  return extractFieldOptionsForPreview(field.options, field)
}

export const extractSubmitActionsForPreview = (
  sf: SubmitField,
): SubmitActionIntrospection[] => {
  return sf.actions.map((action) => {
    const event =
      typeof action.event === 'object'
        ? String((action.event as { type: string }).type)
        : String(action.event)
    const label = action.name
    if (isMessageDescriptor(label)) {
      return {
        event,
        labelMessageId: String(label.id),
        labelDefaultMessage:
          (label.defaultMessage as string | undefined) ?? null,
        buttonType: action.type,
      }
    }
    if (typeof label === 'function') {
      return {
        event,
        labelDefaultMessage: event,
        buttonType: action.type,
      }
    }
    if (typeof label === 'string') {
      return {
        event,
        labelDefaultMessage: label,
        buttonType: action.type,
      }
    }
    return {
      event,
      labelDefaultMessage: extractStaticText(label as StaticText),
      buttonType: action.type,
    }
  })
}

/**
 * Best-effort: run overview `items(answers, …)` with stub inputs so row-level
 * FormText message ids can appear on the OVERVIEW screen for translation tooling.
 */
export const extractOverviewItemsDescriptorsBestEffort = (
  field: OverviewField,
): MessageDescriptorInfo[] => {
  const collected: MessageDescriptorInfo[] = []
  const itemsFn = field.items
  if (typeof itemsFn !== 'function') {
    return collected
  }
  const stubAnswers = {} as FormValue
  const stubExternal = {} as ExternalData
  const locales = ['is', 'en'] as const
  const stubNi = '0000000000'
  for (const locale of locales) {
    try {
      const rows = itemsFn(stubAnswers, stubExternal, stubNi, locale)
      if (!Array.isArray(rows)) continue
      for (const row of rows) {
        for (const d of extractDescriptorsFromKeyValueItem(row)) {
          addDescriptorIfNew(collected, d)
        }
      }
    } catch {
      // Overview factories often require populated answers; ignore.
    }
  }
  return collected
}
