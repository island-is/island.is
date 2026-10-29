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
  isInvalid,
  isRequired,
}: {
  label: string
  value?: CalculatorLocalizedText
  onChange: (next: CalculatorLocalizedText | undefined) => void
  /* Omits blank optional localized values. */
  clearWhenEmpty?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
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
    <FormControl
      id={isId}
      marginBottom="none"
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      <FormControl.Label>{label}</FormControl.Label>
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <TextInput
          aria-label={`${label} (Icelandic)`}
          placeholder="Icelandic"
          value={is}
          isDisabled={isDisabled}
          onChange={(ev) => update(ev.target.value, en)}
        />
        <TextInput
          id={`${isId}-en`}
          aria-label={`${label} (English)`}
          placeholder="English"
          value={en}
          isDisabled={isDisabled}
          isInvalid={false}
          isRequired={false}
          onChange={(ev) => update(is, ev.target.value)}
        />
      </Stack>
      {isInvalid && (
        <FormControl.ValidationMessage>
          Icelandic label is required.
        </FormControl.ValidationMessage>
      )}
    </FormControl>
  )
}
