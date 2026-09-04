import {
  FormControl,
  IconButton,
  Select,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { DeleteIcon } from '@contentful/f36-icons'

import type {
  CalculatorLocalizedText,
  CalculatorSectionField,
} from '@island.is/tax-calculators'

import { TaxCalculatorFieldInputType } from '../../../../graphql/schema'
import { FieldContract } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'

interface Props {
  field: CalculatorSectionField
  contract: FieldContract
  isLoading: boolean
  onChange: (patch: Partial<CalculatorSectionField>) => void
  onRemove: () => void
}

/* `choice` is a dropdown or a switch: nowhere to put grey text. */
type Control =
  | { kind: 'choice' }
  | { kind: 'text'; unit?: CalculatorLocalizedText }

const CONTROL_BY_INPUT_TYPE: Record<TaxCalculatorFieldInputType, Control> = {
  [TaxCalculatorFieldInputType.Currency]: {
    kind: 'text',
    unit: { is: 'krónur', en: 'ISK' },
  },
  [TaxCalculatorFieldInputType.Percentage]: {
    kind: 'text',
    unit: { is: '%', en: '%' },
  },
  [TaxCalculatorFieldInputType.Count]: {
    kind: 'text',
    unit: { is: 'fjöldi', en: 'count' },
  },
  [TaxCalculatorFieldInputType.Date]: {
    kind: 'text',
    unit: { is: 'dagsetning', en: 'date' },
  },
  [TaxCalculatorFieldInputType.Number]: { kind: 'text' },
  [TaxCalculatorFieldInputType.String]: { kind: 'text' },
  [TaxCalculatorFieldInputType.Year]: { kind: 'choice' },
  [TaxCalculatorFieldInputType.Month]: { kind: 'choice' },
  [TaxCalculatorFieldInputType.Boolean]: { kind: 'choice' },
  [TaxCalculatorFieldInputType.Enum]: { kind: 'choice' },
}

const controlFor = (
  key: string,
  contract: FieldContract,
): Control | undefined => {
  const picked = contract.get(key)
  return picked ? CONTROL_BY_INPUT_TYPE[picked.inputType] : undefined
}

const placeholderFor = (key: string, contract: FieldContract) => {
  const control = controlFor(key, contract)
  const unit = control?.kind === 'text' ? control.unit : undefined
  return unit ? { ...unit } : undefined
}

const isSameText = (
  a: CalculatorLocalizedText | undefined,
  b: CalculatorLocalizedText | undefined,
) => a?.is === b?.is && a?.en === b?.en

export const SectionFieldRow = ({
  field,
  contract,
  isLoading,
  onChange,
  onRemove,
}: Props) => {
  const contractField = field.key ? contract.get(field.key) : undefined
  /* A stored key needs an option of its own or the Select renders blank, but
   * it is only knowably stale once the contract has loaded. */
  const isMissingFromContract = Boolean(field.key) && !contractField
  const isStaleKey = isMissingFromContract && !isLoading

  return (
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
              /* Refreshed only while untouched, so editor wording survives a
               * re-pick -- but dropped outright for a control that cannot
               * show it, rather than persisted where nothing reads it. */
              if (
                controlFor(key, contract)?.kind === 'choice' ||
                isSameText(
                  field.placeholder,
                  field.key ? placeholderFor(field.key, contract) : undefined,
                )
              ) {
                patch.placeholder = placeholderFor(key, contract)
              }
              onChange(patch)
            }}
            isDisabled={isLoading}
          >
            <Select.Option value="" isDisabled>
              {isLoading ? 'Loading fields…' : 'Select a field'}
            </Select.Option>
            {isMissingFromContract && (
              <Select.Option value={field.key}>
                {isStaleKey
                  ? `${field.key} — not in this calculator`
                  : field.key}
              </Select.Option>
            )}
            {/* A star, not "required": FormControl already renders its own
             * `(required)` above, meaning something else. */}
            {[...contract.values()].map((available) => (
              <Select.Option key={available.key} value={available.key}>
                {available.required ? `${available.key} *` : available.key}
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

      {isStaleKey && (
        <Text fontColor="red600" fontSize="fontSizeS">
          This calculator no longer offers &quot;{field.key}&quot;. The value is
          kept, but nothing will render for it.
        </Text>
      )}

      {contractField?.dependsOn && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          Shown only when &quot;{contractField.dependsOn.field}&quot; is{' '}
          {contractField.dependsOn.equals ? 'on' : 'off'} — set by the
          calculator, not editable here.
        </Text>
      )}

      {field.key && (
        <>
          <LocalizedTextFields
            label="Field label"
            value={field.label}
            onChange={(next) => onChange({ label: next })}
            clearWhenEmpty
          />
          {controlFor(field.key, contract)?.kind === 'text' && (
            <LocalizedTextFields
              label="Field placeholder"
              value={field.placeholder}
              onChange={(next) => onChange({ placeholder: next })}
              clearWhenEmpty
            />
          )}
        </>
      )}
    </Stack>
  )
}
