import { Box, PhoneInput } from '@island.is/island-ui/core'
import {
  SDF_FIELD_CONTROL_PADDING_TOP,
  getSdfFieldMargins,
} from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfPhoneField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => {
  // Mirrors the legacy `PhoneFormField`: render the island-ui `PhoneInput` (with
  // the +354 country-code prefix and number formatting) rather than a plain text
  // input. The country-code dropdown stays disabled unless the field opted into
  // `enableCountrySelector`, matching the legacy default. `onFormatValueChange`
  // emits the full value including the country code, which is what we persist.
  const enableCountrySelector = component.enableCountrySelector === true

  return (
    <Box {...getSdfFieldMargins(component)}>
      <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
        <PhoneInput
          id={component.id ?? ''}
          name={component.id ?? ''}
          label={component.label ?? ''}
          placeholder={component.placeholder ?? ''}
          disabled={component.disabled}
          required={component.required}
          hasError={!!error}
          errorMessage={error}
          // Fall back to the template `defaultValue` (resolved server-side from
          // `userProfile.data.mobilePhoneNumber`) until the user edits the field,
          // mirroring how SdfTextField auto-fills email. `PhoneInput`'s
          // `useEffectOnce` then persists the prefixed value as the answer.
          value={
            (currentValue as string) ?? (component.defaultValue as string) ?? ''
          }
          disableDropdown={!enableCountrySelector}
          allowedCountryCodes={component.allowedCountryCodes}
          onFormatValueChange={(value) => handleChange(value)}
          // Always `md`: `xs` renders the label outside the bordered box, unlike
          // the neighboring (HALF-width) email field and the legacy PhoneFormField.
          size="md"
        />
      </Box>
    </Box>
  )
}
