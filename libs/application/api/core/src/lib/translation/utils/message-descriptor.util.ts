import type { MessageDescriptor } from 'react-intl'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import type {
  Application,
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
    if (typeof text.defaultMessage === 'string') {
      return text.defaultMessage
    }
    return text.id != null ? String(text.id) : null
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

export const toMessageDescriptorInfo = (
  value: MessageDescriptor,
): MessageDescriptorInfo => ({
  id: String(value.id),
  defaultMessage:
    typeof value.defaultMessage === 'string' ? value.defaultMessage : undefined,
  description:
    typeof value.description === 'string' ? value.description : undefined,
})

/**
 * Recursively collects `defineMessages` / MessageDescriptor objects from a messages
 * module. Continues into extra keys on a descriptor (e.g. nested `paragraphs`) so
 * those strings are not dropped.
 */
export const flattenMessageDescriptors = (
  root: unknown,
): MessageDescriptorInfo[] => {
  const descriptors: MessageDescriptorInfo[] = []
  const seen = new Set<string>()
  const visited = new WeakSet<object>()

  const visit = (value: unknown) => {
    if (value == null) return
    const valueType = typeof value
    if (
      valueType === 'function' ||
      valueType === 'string' ||
      valueType === 'number' ||
      valueType === 'boolean' ||
      valueType === 'bigint' ||
      valueType === 'symbol'
    ) {
      return
    }
    if (typeof value !== 'object') return
    if (visited.has(value)) return
    visited.add(value)

    if (isMessageDescriptor(value) && 'defaultMessage' in value) {
      const info = toMessageDescriptorInfo(value)
      if (!seen.has(info.id)) {
        seen.add(info.id)
        descriptors.push(info)
      }
    }

    if (Array.isArray(value)) {
      for (const el of value) {
        visit(el)
      }
      return
    }

    for (const nested of Object.values(value)) {
      visit(nested)
    }
  }

  visit(root)
  return descriptors
}

export const tryInvokeFormTextFunction = (
  fn: Function,
): {
  descriptors: MessageDescriptorInfo[]
  staticText: string | null
} => {
  try {
    const mockApp: Application = {
      answers: {},
      externalData: {},
      id: '',
      state: '',
      typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      applicant: '',
      assignees: [],
      applicantActors: [],
      modified: new Date(),
      created: new Date(),
      status: ApplicationStatus.DRAFT,
    }
    const result = fn(mockApp, 'is')
    if (isMessageDescriptor(result)) {
      return {
        descriptors: [toMessageDescriptorInfo(result)],
        staticText: extractStaticText(result),
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
    return [toMessageDescriptorInfo(text)]
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
    return [toMessageDescriptorInfo(value)]
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
    if (visited.has(value)) {
      return []
    }
    visited.add(value)
    const out: MessageDescriptorInfo[] = []
    for (const v of Object.values(value)) {
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
        extractMessageDescriptorsFromFormText(t),
      )
    }
    return acc
  }
  return extractMessageDescriptorsFromFormText(text)
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
