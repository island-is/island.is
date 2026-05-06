import type {
  MessageDescriptor,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../types/translationWorkspace'
import { filterPreviewMultiFieldChildren } from './translationWorkspaceMultiFieldChildren'

const NON_FOCUSABLE_TYPES = new Set([
  'DIVIDER',
  'SUBMIT',
  'HIDDEN_INPUT',
  'HIDDEN_INPUT_WITH_WATCHED_VALUE',
])

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randDigits = (n: number) =>
  Array.from({ length: n }, () => randInt(0, 9)).join('')

const SAMPLE_NAMES = [
  'Jón Jónsson',
  'Guðrún Sigurðardóttir',
  'Ólafur Magnússon',
  'Anna Kristjánsdóttir',
  'Einar Helgason',
  'Sigríður Björnsdóttir',
]

const SAMPLE_WORDS = [
  'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'halló', 'heimur',
  'gögn', 'umsókn', 'skjal', 'upplýsingar', 'þjónusta', 'skipulag',
]

const randomSentence = (wordCount: number) => {
  const words = Array.from(
    { length: wordCount },
    () => SAMPLE_WORDS[randInt(0, SAMPLE_WORDS.length - 1)],
  )
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ')
}

export const STRINGS_TAB_ID = 'strings'
export const FIELDS_TAB_ID = 'fields'

export const generatePreviewValueForField = (
  field: ScreenIntrospection,
): string => {
  switch (field.type) {
    case 'PHONE':
      // Icelandic mobile: 7 digits starting with 6/7/8
      return `${randInt(6, 8)}${randDigits(6)}`
    case 'EMAIL':
      return `${SAMPLE_NAMES[randInt(0, SAMPLE_NAMES.length - 1)].split(' ')[0].toLowerCase()}${randInt(1, 99)}@example.com`
    case 'BANK_ACCOUNT':
      // Icelandic: 4 bank + 2 ledger + 6 account = 12 digits
      return `${randDigits(4)}-${randDigits(2)}-${randDigits(6)}`
    case 'NATIONAL_ID_WITH_NAME': {
      // Kennitala format: DDMMYY-XXXX
      const day = String(randInt(1, 28)).padStart(2, '0')
      const month = String(randInt(1, 12)).padStart(2, '0')
      const year = String(randInt(50, 99)).padStart(2, '0')
      return `${day}${month}${year}-${randDigits(4)}`
    }
    case 'DATE': {
      const y = randInt(2020, 2026)
      const m = String(randInt(1, 12)).padStart(2, '0')
      const d = String(randInt(1, 28)).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
    case 'RADIO':
      return field.radioOptions?.[0]?.value ?? ''
    case 'CHECKBOX':
      return field.checkboxOptions?.[0]?.value ?? ''
    case 'FILEUPLOAD':
      return 'document.pdf'
    case 'COMPANY_SEARCH':
      return `${randomSentence(2)} ehf.`
    case 'TEXT':
    default:
      return randomSentence(randInt(3, 7))
  }
}

/** Build a flat list of leaf fields from the preview screen tree. */
export const flattenFocusableFields = (
  screens: ScreenIntrospection[],
): ScreenIntrospection[] => {
  const result: ScreenIntrospection[] = []
  for (const screen of screens) {
    if (screen.type === 'MULTI_FIELD') {
      const children = filterPreviewMultiFieldChildren(screen.children)
      for (const child of children) {
        if (!NON_FOCUSABLE_TYPES.has(child.type)) {
          result.push(child)
        }
      }
    } else if (!NON_FOCUSABLE_TYPES.has(screen.type)) {
      result.push(screen)
    }
  }
  return result
}

export interface FieldProperty {
  role: 'title' | 'description' | 'label' | 'placeholder' | 'error'
  label: string
  descriptor: MessageDescriptor | null
}

export const getFieldProperties = (
  field: ScreenIntrospection,
  validationDescriptorsByPath: Record<string, ValidationMessageDescriptor[]>,
): FieldProperty[] => {
  const props: FieldProperty[] = []
  const descriptors = field.messageDescriptors

  const titleDescriptor = field.title
    ? descriptors.find((d) => d.defaultMessage === field.title) ?? null
    : null
  if (titleDescriptor) {
    props.push({ role: 'title', label: 'Title', descriptor: titleDescriptor })
  }

  const descDescriptor = field.description
    ? descriptors.find((d) => d.defaultMessage === field.description) ?? null
    : null
  if (descDescriptor) {
    props.push({
      role: 'description',
      label: 'Description',
      descriptor: descDescriptor,
    })
  }

  const usedIds = new Set(
    [titleDescriptor?.id, descDescriptor?.id].filter(Boolean) as string[],
  )
  const remaining = descriptors.filter((d) => !usedIds.has(d.id))
  for (const d of remaining) {
    props.push({ role: 'label', label: 'Label', descriptor: d })
  }

  const errorDescs = validationDescriptorsByPath[field.id]
  if (errorDescs) {
    for (const d of errorDescs) {
      props.push({ role: 'error', label: 'Error message', descriptor: d })
    }
  }

  return props
}
