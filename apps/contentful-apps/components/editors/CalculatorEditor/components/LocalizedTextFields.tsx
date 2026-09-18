import { useId } from 'react'
import { FormControl, Stack, TextInput } from '@contentful/f36-components'

import type { CalculatorLocalizedText } from '@island.is/tax-calculators'

// Kept at module scope: a component redefined inside a parent's render body is
// remounted by React on every parent re-render, which drops input focus on
// every keystroke.
export const LocalizedTextFields = ({
  label,
  value,
  onChange,
  clearWhenEmpty,
  isDisabled,
}: {
  label: string
  value?: CalculatorLocalizedText
  onChange: (next: CalculatorLocalizedText | undefined) => void
  /* Drops the whole pair once both languages are blank, so an unset optional
   * text stays absent rather than persisting as `{ is: '' }`. */
  clearWhenEmpty?: boolean
  isDisabled?: boolean
}) => {
  /* One label cannot be associated with two inputs by `htmlFor` alone, so each
   * input carries its own `aria-label` or both announce unlabelled. */
  const isId = useId()
  const is = value?.is ?? ''
  const en = value?.en ?? ''

  const update = (nextIs: string, nextEn: string) => {
    if (clearWhenEmpty && !nextIs && !nextEn) {
      onChange(undefined)
      return
    }
    onChange({ is: nextIs, en: nextEn || undefined })
  }

  return (
    <FormControl marginBottom="none">
      <FormControl.Label htmlFor={isId}>{label}</FormControl.Label>
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <TextInput
          id={isId}
          aria-label={`${label} (Icelandic)`}
          placeholder="Icelandic"
          value={is}
          isDisabled={isDisabled}
          onChange={(ev) => update(ev.target.value, en)}
        />
        <TextInput
          aria-label={`${label} (English)`}
          placeholder="English"
          value={en}
          isDisabled={isDisabled}
          onChange={(ev) => update(is, ev.target.value)}
        />
      </Stack>
    </FormControl>
  )
}
