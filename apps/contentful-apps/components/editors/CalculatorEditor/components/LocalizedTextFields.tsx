import { useId } from 'react'
import { FormControl, Stack, TextInput } from '@contentful/f36-components'

import type { CalculatorLocalizedText } from '@island.is/tax-calculators'

// Module scope preserves focus across parent renders.
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
  /* Omits blank optional localized values. */
  clearWhenEmpty?: boolean
  isDisabled?: boolean
}) => {
  /* Labels each localized input separately. */
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
