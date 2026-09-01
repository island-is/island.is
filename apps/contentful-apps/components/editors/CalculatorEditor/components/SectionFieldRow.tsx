import {
  FormControl,
  IconButton,
  Select,
  Stack,
  TextInput,
} from '@contentful/f36-components'
import { DeleteIcon } from '@contentful/f36-icons'

import { CalculatorSectionField } from '@island.is/tax-calculators'

import { AvailableField } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'

interface Props {
  field: CalculatorSectionField
  availableFields: AvailableField[]
  isLoading: boolean
  onChange: (patch: Partial<CalculatorSectionField>) => void
  onRemove: () => void
}

export const SectionFieldRow = ({
  field,
  availableFields,
  isLoading,
  onChange,
  onRemove,
}: Props) => (
  <Stack
    flexDirection="column"
    alignItems="stretch"
    spacing="spacingXs"
    style={{
      border: '1px solid #e5e8eb',
      borderRadius: 4,
      padding: 8,
    }}
  >
    <Stack flexDirection="row" alignItems="flex-end" spacing="spacingXs">
      <FormControl isRequired marginBottom="none" style={{ flex: 1 }}>
        <FormControl.Label>Field</FormControl.Label>
        <Select
          value={field.key}
          onChange={(ev) => {
            const key = ev.target.value
            const patch: Partial<CalculatorSectionField> = { key }
            // Prefill: an editor picking a field for the first time starts
            // from the backend's default Icelandic label, not a blank input.
            if (!field.label) {
              const matched = availableFields.find(
                (available) => available.key === key,
              )
              if (matched) {
                patch.label = { is: matched.label }
              }
            }
            onChange(patch)
          }}
          isDisabled={isLoading}
        >
          <Select.Option value="" isDisabled>
            {isLoading ? 'Loading fields…' : 'Select a field'}
          </Select.Option>
          {availableFields.map((availableField) => (
            <Select.Option key={availableField.key} value={availableField.key}>
              {availableField.label}
            </Select.Option>
          ))}
        </Select>
      </FormControl>
      <FormControl marginBottom="none" style={{ width: 96 }}>
        <FormControl.Label>Span</FormControl.Label>
        <TextInput
          type="number"
          inputMode="numeric"
          value={String(field.span)}
          onChange={(ev) => {
            const span = Number(ev.target.value)
            if (Number.isNaN(span)) return
            onChange({ span: Math.min(12, Math.max(1, span)) })
          }}
        />
      </FormControl>
      <IconButton
        aria-label="Remove field"
        icon={<DeleteIcon />}
        onClick={onRemove}
      />
    </Stack>

    {field.key && (
      <>
        <LocalizedTextFields
          label="Field label"
          value={field.label}
          onChange={(next) => onChange({ label: next })}
          clearWhenEmpty
        />
        <LocalizedTextFields
          label="Field placeholder"
          value={field.placeholder}
          onChange={(next) => onChange({ placeholder: next })}
          clearWhenEmpty
        />
      </>
    )}
  </Stack>
)
