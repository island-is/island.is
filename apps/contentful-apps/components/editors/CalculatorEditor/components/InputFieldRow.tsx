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
  CalculatorInputSectionField,
  CalculatorLocalizedText,
} from '@island.is/tax-calculators'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '../../../../graphql/schema'
import { InputContractField, InputFieldContract } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'

interface Props {
  field: CalculatorInputSectionField
  contract: InputFieldContract
  usedKeys: Set<string>
  isLoading: boolean
  isDisabled?: boolean
  issues?: string[]
  isDuplicate?: boolean
  onChange: (patch: Partial<CalculatorInputSectionField>) => void
  onRemove: () => void
}

/* `choice` is a dropdown or a switch: nowhere to put grey text. */
type Control =
  | { kind: 'choice' }
  | { kind: 'text'; unit?: CalculatorLocalizedText }

/* Resolved on `type` FIRST, then `semantic` as an override layer. The old map
 * keyed one flat enum; the metadata now splits it in two, and a semantic-only
 * lookup would silently lose the cases that are types rather than semantics --
 * BOOLEAN and SELECT are choice-like, DATE is text with a hint, and neither
 * carries a semantic at all. */
const CONTROL_BY_TYPE: Record<TaxCalculatorInputFieldType, Control> = {
  [TaxCalculatorInputFieldType.Boolean]: { kind: 'choice' },
  [TaxCalculatorInputFieldType.Select]: { kind: 'choice' },
  [TaxCalculatorInputFieldType.Date]: {
    kind: 'text',
    unit: { is: 'dagsetning', en: 'date' },
  },
  // Plain number and free text: text controls with no unit hint. Stated rather
  // than left to fall through, or the most common field type would render no
  // placeholder editor at all.
  [TaxCalculatorInputFieldType.Number]: { kind: 'text' },
  [TaxCalculatorInputFieldType.String]: { kind: 'text' },
}

const CONTROL_BY_SEMANTIC: Partial<
  Record<TaxCalculatorInputFieldSemantic, Control>
> = {
  [TaxCalculatorInputFieldSemantic.Currency]: {
    kind: 'text',
    unit: { is: 'krónur', en: 'ISK' },
  },
  [TaxCalculatorInputFieldSemantic.Percentage]: {
    kind: 'text',
    unit: { is: '%', en: '%' },
  },
  [TaxCalculatorInputFieldSemantic.Count]: {
    kind: 'text',
    unit: { is: 'fjöldi', en: 'count' },
  },
  [TaxCalculatorInputFieldSemantic.Year]: { kind: 'choice' },
  [TaxCalculatorInputFieldSemantic.Month]: { kind: 'choice' },
}

const controlForField = (field: InputContractField | undefined) => {
  if (!field) return undefined
  const bySemantic = field.semantic
    ? CONTROL_BY_SEMANTIC[field.semantic]
    : undefined
  return bySemantic ?? CONTROL_BY_TYPE[field.type]
}

const controlFor = (key: string, contract: InputFieldContract) =>
  controlForField(contract.get(key))

const placeholderFor = (key: string, contract: InputFieldContract) => {
  const control = controlFor(key, contract)
  const unit = control?.kind === 'text' ? control.unit : undefined
  return unit ? { ...unit } : undefined
}

const isSameText = (
  a: CalculatorLocalizedText | undefined,
  b: CalculatorLocalizedText | undefined,
) => a?.is === b?.is && a?.en === b?.en

export const InputFieldRow = ({
  field,
  contract,
  usedKeys,
  isLoading,
  isDisabled,
  issues,
  isDuplicate,
  onChange,
  onRemove,
}: Props) => {
  const contractField = field.key ? contract.get(field.key) : undefined
  /* A stored key needs an option of its own or the Select renders blank, but
   * it is only knowably stale once the contract has loaded. */
  const isMissingFromContract = Boolean(field.key) && !contractField
  const isStaleKey = isMissingFromContract && !isLoading
  const isDraft = !field.key
  const hasError = isStaleKey || isDuplicate || Boolean(issues?.length)

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
        <FormControl
          isRequired
          isInvalid={hasError}
          marginBottom="none"
          style={{ flex: 1 }}
        >
          <FormControl.Label>Field</FormControl.Label>
          <Select
            value={field.key}
            isDisabled={isLoading || isDisabled}
            onChange={(ev) => {
              const key = ev.target.value
              const patch: Partial<CalculatorInputSectionField> = { key }
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
             * `(required)` above, meaning something else. Keys already placed
             * elsewhere are dropped, except this row's own. */}
            {[...contract.values()]
              .filter(
                (available) =>
                  available.key === field.key || !usedKeys.has(available.key),
              )
              .map((available) => (
                <Select.Option key={available.key} value={available.key}>
                  {available.required ? `${available.key} *` : available.key}
                </Select.Option>
              ))}
          </Select>
          {isStaleKey && (
            <FormControl.ValidationMessage>
              This calculator no longer offers &quot;{field.key}&quot;. The value
              is kept, but nothing will render for it.
            </FormControl.ValidationMessage>
          )}
          {isDuplicate && (
            <FormControl.ValidationMessage>
              This field is already placed in another section. Each input may
              appear once.
            </FormControl.ValidationMessage>
          )}
          {issues?.map((issue) => (
            <FormControl.ValidationMessage key={issue}>
              {issue}
            </FormControl.ValidationMessage>
          ))}
        </FormControl>
        <FormControl marginBottom="none" style={{ width: 96 }}>
          <FormControl.Label>Span</FormControl.Label>
          <TextInput
            type="number"
            inputMode="numeric"
            value={String(field.span)}
            isDisabled={isDisabled}
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
          isDisabled={isDisabled}
          onClick={onRemove}
        />
      </Stack>

      {isDraft && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          Not saved yet — pick a field.
        </Text>
      )}

      {contractField?.options && contractField.options.length > 0 && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          Options: {contractField.options.join(', ')} — set by the calculator,
          not editable here.
        </Text>
      )}

      {contractField?.dependsOn && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          Shown only when &quot;{contractField.dependsOn.fieldKey}&quot; is{' '}
          {String(contractField.dependsOn.equals)} — set by the calculator, not
          editable here.
        </Text>
      )}

      {field.key && (
        <>
          <LocalizedTextFields
            label="Field label"
            value={field.label}
            isDisabled={isDisabled}
            onChange={(next) => onChange({ label: next })}
            clearWhenEmpty
          />
          {controlFor(field.key, contract)?.kind === 'text' && (
            <LocalizedTextFields
              label="Field placeholder"
              value={field.placeholder}
              isDisabled={isDisabled}
              onChange={(next) => onChange({ placeholder: next })}
              clearWhenEmpty
            />
          )}
        </>
      )}
    </Stack>
  )
}
