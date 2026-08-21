import { containsHtml } from '@island.is/judicial-system/formatters'

export const replaceTabs = (str: string) =>
  str?.replace(/(?: \t+|\t+ |\t+)/g, ' ')

// Whitespace-only input is effectively empty; persist it as '' so the server
// field is cleared. Real content is passed through untouched - leading and
// trailing whitespace around non-whitespace text is preserved.
export const normalizeBlankString = (value: string): string =>
  value.trim() === '' ? '' : value

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  (Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null)

// Applies normalizeBlankString to every string-valued property of a mutation
// input, recursing into plain nested objects so user-entered strings one
// level down (e.g. substance amounts, crime scene places) are covered too.
// Safe for mixed payloads: enums, ISO dates and ids are strings but never
// whitespace-only, and arrays and class instances such as Date are left
// untouched.
export const normalizeBlankStrings = <T extends object>(input: T): T =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      typeof value === 'string'
        ? normalizeBlankString(value)
        : isPlainObject(value)
        ? normalizeBlankStrings(value)
        : value,
    ]),
  ) as T

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Converts plain text to the paragraph-based HTML the TinyMCE editor produces,
// one <p> per line. Text that already contains markup is passed through so
// stored rich text is not double-escaped.
export const textToHtml = (str: string) =>
  !str || containsHtml(str)
    ? str
    : str
        .split('\n')
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join('')
