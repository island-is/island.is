import {
  FormControl,
  IconButton,
  Select,
  Stack,
  Text,
} from '@contentful/f36-components'
import { DeleteIcon } from '@contentful/f36-icons'

import type { CalculatorOutputItemField } from '@island.is/tax-calculators'

import { OutputContractItemField } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'

interface Props {
  item: CalculatorOutputItemField
  available: OutputContractItemField[]
  usedKeys: Set<string>
  isLoading: boolean
  isDisabled?: boolean
  issues?: string[]
  onChange: (patch: Partial<CalculatorOutputItemField>) => void
  onRemove: () => void
}

export const OutputItemFieldRow = ({
  item,
  available,
  usedKeys,
  isLoading,
  isDisabled,
  issues,
  onChange,
  onRemove,
}: Props) => {
  const match = available.find((candidate) => candidate.key === item.key)
  const isMissing = Boolean(item.key) && !match
  const isStaleKey = isMissing && !isLoading
  const hasError = isStaleKey || Boolean(issues?.length)

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingXs">
      <Stack flexDirection="row" alignItems="flex-end" spacing="spacingXs">
        <FormControl
          isRequired
          isInvalid={hasError}
          marginBottom="none"
          style={{ flex: 1 }}
        >
          <FormControl.Label>Item field</FormControl.Label>
          <Select
            value={item.key}
            isDisabled={isLoading || isDisabled}
            onChange={(ev) => onChange({ key: ev.target.value })}
          >
            <Select.Option value="" isDisabled>
              Select an item field
            </Select.Option>
            {isMissing && (
              <Select.Option value={item.key}>
                {isStaleKey
                  ? `${item.key} — not in this array`
                  : item.key}
              </Select.Option>
            )}
            {/* Each item key may appear once per array, so keys already used
             * are dropped -- except this row's own, which must stay selectable
             * or the Select renders blank. */}
            {available
              .filter(
                (candidate) =>
                  candidate.key === item.key || !usedKeys.has(candidate.key),
              )
              .map((candidate) => (
                <Select.Option key={candidate.key} value={candidate.key}>
                  {candidate.semantic
                    ? `${candidate.key} · ${candidate.type} · ${candidate.semantic}`
                    : `${candidate.key} · ${candidate.type}`}
                </Select.Option>
              ))}
          </Select>
          {isStaleKey && (
            <FormControl.ValidationMessage>
              This array no longer offers &quot;{item.key}&quot;.
            </FormControl.ValidationMessage>
          )}
          {issues?.map((issue) => (
            <FormControl.ValidationMessage key={issue}>
              {issue}
            </FormControl.ValidationMessage>
          ))}
        </FormControl>
        <IconButton
          aria-label="Remove item field"
          icon={<DeleteIcon />}
          isDisabled={isDisabled}
          onClick={onRemove}
        />
      </Stack>

      {!item.key && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          Not saved yet — pick an item field.
        </Text>
      )}

      {item.key && (
        <LocalizedTextFields
          label="Item label"
          value={item.label}
          isDisabled={isDisabled}
          onChange={(next) => onChange({ label: next })}
          clearWhenEmpty
        />
      )}
    </Stack>
  )
}
