import {
  FormControl,
  IconButton,
  Select,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { DeleteIcon } from '@contentful/f36-icons'

import type { CalculatorInputSectionField } from '@island.is/tax-calculators'

import type { InputFieldContract } from '../contract'
import {
  controlForField,
  isSameText,
  placeholderFor,
} from './inputFieldControl'
import { LocalizedTextFields } from './LocalizedTextFields'
import * as styles from './CalculatorEditor.css'

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
  /* Retains stale keys until the contract loads. */
  const isMissingFromContract = Boolean(field.key) && !contractField
  const isStaleKey = isMissingFromContract && !isLoading
  const isDraft = !field.key
  const hasError = isStaleKey || isDuplicate || Boolean(issues?.length)

  return (
    <Stack
      flexDirection="column"
      alignItems="stretch"
      spacing="spacingXs"
      className={styles.fieldRow}
    >
      <Stack flexDirection="row" alignItems="flex-end" spacing="spacingXs">
        <FormControl
          isRequired
          isInvalid={hasError}
          marginBottom="none"
          className={styles.grow}
        >
          <FormControl.Label>Field</FormControl.Label>
          <Select
            value={field.key}
            isDisabled={isLoading || isDisabled}
            onChange={(ev) => {
              const key = ev.target.value
              const patch: Partial<CalculatorInputSectionField> = { key }
              /* Refreshes untouched placeholders from the selected field. */
              if (
                controlForField(contract.get(key))?.kind === 'choice' ||
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
              This calculator no longer offers &quot;{field.key}&quot;. The
              value is kept, but nothing will render for it.
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
        <FormControl marginBottom="none" className={styles.spanControl}>
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
          {controlForField(contract.get(field.key))?.kind === 'text' && (
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
