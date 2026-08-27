import { Form } from '@island.is/cms'

import { GenericFormFieldValueInput } from '../dto/genericForm.input'

/** Matches [some form field id] within an email subject */
const FIELD_TOKEN_REGEX = /\[([^[\]]+)\]/g

/** Keeps a single injected value from taking over the whole subject */
const MAX_INJECTED_VALUE_LENGTH = 100

const sanitizeInjectedValue = (value: string) =>
  value
    // Newlines in an email subject are not allowed (email header injection)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_INJECTED_VALUE_LENGTH)
    .trim()

/**
 * Maps every way a CMS editor can refer to a form field (id, name and title)
 * to the value that the user entered for that field
 */
const createFieldValueLookup = (
  form: Form,
  fieldValues: GenericFormFieldValueInput[],
) => {
  const lookup = new Map<string, string>()

  for (const { id, value } of fieldValues) {
    const field = form.fields?.find((formField) => formField.id === id)

    if (!field) {
      continue
    }

    const sanitizedValue = sanitizeInjectedValue(value)

    for (const key of [field.id, field.name, field.title]) {
      const trimmedKey = key?.trim()
      if (trimmedKey) {
        lookup.set(trimmedKey.toLowerCase(), sanitizedValue)
      }
    }
  }

  return lookup
}

/**
 * Replaces [form field id] tokens within the email subject that's defined in the CMS
 * with the values that the user entered, for example:
 *
 *   "[3xAmPl3Id] - Application received" -> "John Doe - Application received"
 *
 * Fields can be referred to by their id, name or title. Tokens that don't match
 * a form field are left untouched so that CMS editors notice their typos.
 */
export const injectFormFieldValuesIntoEmailSubject = (
  emailSubject: string,
  form: Form,
  fieldValues: GenericFormFieldValueInput[] = [],
): string => {
  const lookup = createFieldValueLookup(form, fieldValues)

  return emailSubject
    .replace(FIELD_TOKEN_REGEX, (token, key: string) => {
      const value = lookup.get(key.trim().toLowerCase())
      return value === undefined ? token : value
    })
    .replace(/\s+/g, ' ')
    .trim()
}
