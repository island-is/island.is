type UnknownRecord = Record<string, unknown>

type LanguageValue = {
  is?: unknown
  en?: unknown
}

const toTrimmedString = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : ''
}

const isRecord = (value: unknown): value is UnknownRecord => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const FIELDS_TO_CHECK = [
  'name',
  'description',
  'title',
  'confirmationHeader',
  'confirmationText',
  'additionalInfo',
  'label',
  'buttonText',
  'waitingText',
  'organizationDisplayName',
  'formName',
]

export const hasEnglishForAllNameFields = (root: unknown): boolean => {
  const stack: unknown[] = [root]
  const visited = new WeakSet<object>()

  while (stack.length > 0) {
    const current = stack.pop()

    if (!current || typeof current !== 'object') {
      continue
    }

    if (visited.has(current as object)) {
      continue
    }
    visited.add(current as object)

    if (Array.isArray(current)) {
      for (const item of current) {
        stack.push(item)
      }
      continue
    }

    const record = current as UnknownRecord

    for (const [key, value] of Object.entries(record)) {
      if (FIELDS_TO_CHECK.includes(key)) {
        if (isRecord(value)) {
          const lang = value as LanguageValue
          const isValue = toTrimmedString(lang.is)
          const enValue = toTrimmedString(lang.en)

          if (isValue.length > 0 && enValue.length === 0) {
            return false
          }
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (isRecord(item)) {
              const lang = item as LanguageValue
              const isValue = toTrimmedString(lang.is)
              const enValue = toTrimmedString(lang.en)

              if (isValue.length > 0 && enValue.length === 0) {
                return false
              }
            }
          }
        }
      }

      if (value && typeof value === 'object') {
        stack.push(value)
      }
    }
  }

  return true
}
