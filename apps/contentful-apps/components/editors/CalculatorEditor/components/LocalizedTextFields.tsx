import { FormControl, Stack, TextInput } from '@contentful/f36-components'

import { CalculatorLocalizedText } from '@island.is/tax-calculators'

// Kept at module scope: a component redefined inside a parent's render body is
// remounted by React on every parent re-render, which drops input focus on
// every keystroke.
export const LocalizedTextFields = ({
  label,
  value,
  onChange,
  clearWhenEmpty,
}: {
  label: string
  value?: CalculatorLocalizedText
  onChange: (next: CalculatorLocalizedText | undefined) => void
  /* Drops the whole pair once both languages are blank, so an unset optional
   * text stays absent rather than persisting as `{ is: '' }`. */
  clearWhenEmpty?: boolean
}) => {
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
      <FormControl.Label>{label}</FormControl.Label>
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <TextInput
          placeholder="Icelandic"
          value={is}
          onChange={(ev) => update(ev.target.value, en)}
        />
        <TextInput
          placeholder="English"
          value={en}
          onChange={(ev) => update(is, ev.target.value)}
        />
      </Stack>
    </FormControl>
  )
}
