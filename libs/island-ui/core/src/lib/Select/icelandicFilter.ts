// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import { createFilter } from 'react-select'

type FilterConfig = Parameters<typeof createFilter>[0]

/**
 * react-select's accent-insensitive search (`ignoreAccents`) strips most Latin
 * diacritics — e.g. ö→o, á→a — but its lookup table does NOT include the
 * Icelandic letters ð (eth) and þ (thorn). As a result, typing "Sigurdur"
 * never matches "Sigurður". We normalise those two letters on both the option
 * text and the typed input so Icelandic names stay searchable when typed with
 * plain ASCII letters.
 */
export const normalizeIcelandicLetters = (value: string): string =>
  String(value ?? '')
    .replace(/Ð/g, 'D')
    .replace(/ð/g, 'd')
    .replace(/Þ/g, 'Th')
    .replace(/þ/g, 'th')

/**
 * Drop-in replacement for react-select's `createFilter` that additionally
 * handles ð/þ. Honours any caller-provided `filterConfig` (matchFrom,
 * ignoreCase, stringify, …) — it only pre-normalises the eth/thorn letters.
 */
export const createIcelandicFilter = (
  filterConfig?: FilterConfig,
): ReturnType<typeof createFilter> => {
  const filterOption = createFilter(filterConfig)
  return (option: Parameters<typeof filterOption>[0], rawInput: string) =>
    filterOption(
      {
        ...option,
        label: normalizeIcelandicLetters(option.label),
        value: normalizeIcelandicLetters(option.value),
      },
      rawInput ? normalizeIcelandicLetters(rawInput) : rawInput,
    )
}
