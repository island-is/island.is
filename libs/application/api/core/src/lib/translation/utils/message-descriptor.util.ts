import type { MessageDescriptor } from 'react-intl'
import type {
  FormText,
  FormTextArray,
  FormTextWithLocale,
  KeyValueItem,
  StaticText,
} from '@island.is/application/types'
import type { MessageDescriptorInfo } from '@island.is/application/types'

export const extractStaticText = (
  text: StaticText | undefined,
): string | null => {
  if (!text) return null
  if (typeof text === 'string') return text
  if (typeof text === 'object' && 'defaultMessage' in text) {
    return (text.defaultMessage as string) ?? text.id ?? null
  }
  return null
}

export const isMessageDescriptor = (obj: unknown): obj is MessageDescriptor => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as MessageDescriptor).id === 'string'
  )
}

export const tryInvokeFormTextFunction = (
  fn: Function,
): {
  descriptors: MessageDescriptorInfo[]
  staticText: string | null
} => {
  try {
    const mockApp = {
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
    }
    const result = fn(mockApp, 'is')
    if (isMessageDescriptor(result)) {
      return {
        descriptors: [
          {
            id: String(result.id),
            defaultMessage: result.defaultMessage as string | undefined,
            description: result.description as string | undefined,
          },
        ],
        staticText: extractStaticText(result as StaticText),
      }
    }
  } catch {
    // Function depends on specific application data; skip gracefully.
  }
  return { descriptors: [], staticText: null }
}

export const extractMessageDescriptorsFromFormText = (
  text: FormText | FormTextWithLocale | undefined,
): MessageDescriptorInfo[] => {
  if (!text) return []
  if (typeof text === 'function') return []
  if (typeof text === 'string') return []
  if (isMessageDescriptor(text)) {
    return [
      {
        id: String(text.id),
        defaultMessage: text.defaultMessage as string | undefined,
        description: text.description as string | undefined,
      },
    ]
  }
  return []
}

const MAX_PROPS_DESCRIPTOR_DEPTH = 12

/**
 * Recursively collects `MessageDescriptor`-shaped objects from field `props` (e.g. CUSTOM fields).
 */
export const extractMessageDescriptorsFromPropsDeep = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>,
): MessageDescriptorInfo[] => {
  if (depth > MAX_PROPS_DESCRIPTOR_DEPTH) {
    return []
  }
  if (value === null || value === undefined) {
    return []
  }
  const valueType = typeof value
  if (
    valueType === 'string' ||
    valueType === 'number' ||
    valueType === 'boolean' ||
    valueType === 'bigint' ||
    valueType === 'symbol'
  ) {
    return []
  }
  if (valueType === 'function') {
    return []
  }
  if (isMessageDescriptor(value)) {
    return [
      {
        id: String((value as MessageDescriptor).id),
        defaultMessage: (value as MessageDescriptor).defaultMessage as
          | string
          | undefined,
        description: (value as MessageDescriptor).description as
          | string
          | undefined,
      },
    ]
  }
  if (Array.isArray(value)) {
    if (visited.has(value)) {
      return []
    }
    visited.add(value)
    const out: MessageDescriptorInfo[] = []
    for (const el of value) {
      out.push(
        ...extractMessageDescriptorsFromPropsDeep(el, depth + 1, visited),
      )
    }
    return out
  }
  if (typeof value === 'object') {
    const obj = value as object
    if (visited.has(obj)) {
      return []
    }
    visited.add(obj)
    const out: MessageDescriptorInfo[] = []
    for (const v of Object.values(value as Record<string, unknown>)) {
      out.push(...extractMessageDescriptorsFromPropsDeep(v, depth + 1, visited))
    }
    return out
  }
  return []
}

export const mergeMessageDescriptors = (
  base: MessageDescriptorInfo[],
  extra: MessageDescriptorInfo[],
): MessageDescriptorInfo[] => {
  const out = [...base]
  for (const x of extra) {
    if (!out.some((z) => z.id === x.id)) {
      out.push(x)
    }
  }
  return out
}

export const addDescriptorIfNew = (
  target: MessageDescriptorInfo[],
  d: MessageDescriptorInfo,
) => {
  if (!target.some((x) => x.id === d.id)) {
    target.push(d)
  }
}

export const extractDescriptorsFromFormTextMaybeArray = (
  text: FormText | FormTextArray | undefined,
): MessageDescriptorInfo[] => {
  if (!text) return []
  if (typeof text === 'function') return []
  if (Array.isArray(text)) {
    let acc: MessageDescriptorInfo[] = []
    for (const t of text) {
      acc = mergeMessageDescriptors(
        acc,
        extractMessageDescriptorsFromFormText(t as FormText),
      )
    }
    return acc
  }
  return extractMessageDescriptorsFromFormText(text as FormText)
}

export const extractDescriptorsFromKeyValueItem = (
  item: KeyValueItem,
): MessageDescriptorInfo[] => {
  let out = extractDescriptorsFromFormTextMaybeArray(item.keyText)
  out = mergeMessageDescriptors(
    out,
    extractDescriptorsFromFormTextMaybeArray(item.valueText),
  )
  return out
}
