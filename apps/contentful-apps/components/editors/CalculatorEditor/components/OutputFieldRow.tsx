import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Select,
  Stack,
  Text,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { CalculatorOutputValueField } from '@island.is/tax-calculators'

import { TaxCalculatorOutputFieldType } from '../../../../graphql/schema'
import type { OutputFieldContract } from '../contract'
import type { OutputSectionActions } from '../types'
import * as styles from './CalculatorEditor.css'
import { LocalizedTextFields } from './LocalizedTextFields'
import { SortableRow } from './SortableRow'
import { OutputItemFieldRow } from './OutputItemFieldRow'

interface Props {
  field: CalculatorOutputValueField
  fieldIndex: number
  contract: OutputFieldContract
  isLoading: boolean
  isDisabled?: boolean
  rowIssues: Map<string, string[]>
  actions: OutputSectionActions
}

export const OutputFieldRow = ({
  field,
  fieldIndex,
  contract,
  isLoading,
  isDisabled,
  rowIssues,
  actions,
}: Props) => {
  const contractField = field.key ? contract.get(field.key) : undefined
  const isMissing = Boolean(field.key) && !contractField
  const isStaleKey = isMissing && !isLoading
  const issues = rowIssues.get(field.uid)

  const isArray = contractField?.type === TaxCalculatorOutputFieldType.Array
  const itemFields = field.itemFields ?? []
  /* Retains stale item fields until their key changes. */
  const hasStrandedItems = !isArray && itemFields.length > 0 && !isLoading
  const hasError = isStaleKey || hasStrandedItems || Boolean(issues?.length)
  const available = contractField?.itemFields ?? []
  const usedItemKeys = new Set(itemFields.map((item) => item.key))

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
          <FormControl.Label>Output field</FormControl.Label>
          <Select
            value={field.key}
            isDisabled={isLoading || isDisabled}
            onChange={(ev) =>
              actions.updateField(fieldIndex, { key: ev.target.value })
            }
          >
            <Select.Option value="" isDisabled>
              {isLoading ? 'Loading fields…' : 'Select an output field'}
            </Select.Option>
            {isMissing && (
              <Select.Option value={field.key}>
                {isStaleKey
                  ? `${field.key} — not in this calculator`
                  : field.key}
              </Select.Option>
            )}
            {[...contract.values()].map((candidate) => (
              <Select.Option key={candidate.key} value={candidate.key}>
                {candidate.semantic
                  ? `${candidate.key} · ${candidate.type} · ${candidate.semantic}`
                  : `${candidate.key} · ${candidate.type}`}
              </Select.Option>
            ))}
          </Select>
          {isStaleKey && (
            <FormControl.ValidationMessage>
              This calculator no longer returns &quot;{field.key}&quot;.
            </FormControl.ValidationMessage>
          )}
          {hasStrandedItems && (
            <FormControl.ValidationMessage>
              &quot;{field.key}&quot; is not an array, so its item fields cannot
              render. Remove them or pick an array output.
            </FormControl.ValidationMessage>
          )}
          {issues?.map((issue) => (
            <FormControl.ValidationMessage key={issue}>
              {issue}
            </FormControl.ValidationMessage>
          ))}
        </FormControl>
        <IconButton
          aria-label="Remove output field"
          icon={<DeleteIcon />}
          isDisabled={isDisabled}
          onClick={() => actions.removeField(fieldIndex)}
        />
      </Stack>

      {!field.key && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          Not saved yet — pick an output field.
        </Text>
      )}

      {field.key && (
        <>
          <LocalizedTextFields
            label="Field label"
            value={field.label}
            isDisabled={isDisabled}
            onChange={(next) =>
              actions.updateField(fieldIndex, { label: next })
            }
            clearWhenEmpty
          />
          <Checkbox
            isChecked={field.variant === 'emphasis'}
            isDisabled={isDisabled}
            onChange={() =>
              actions.updateField(fieldIndex, {
                variant: field.variant === 'emphasis' ? undefined : 'emphasis',
              })
            }
          >
            Bold
          </Checkbox>
        </>
      )}

      {isArray && (
        <Stack
          flexDirection="column"
          alignItems="stretch"
          spacing="spacingXs"
          className={styles.itemFields}
        >
          <SortableContext
            items={itemFields.map((item) => item.uid)}
            strategy={verticalListSortingStrategy}
          >
            {itemFields.map((item, itemIndex) => (
              <SortableRow
                key={item.uid}
                id={item.uid}
                label={`Reorder item field ${itemIndex + 1}`}
                isDisabled={isDisabled}
              >
                <OutputItemFieldRow
                  item={item}
                  available={available}
                  usedKeys={usedItemKeys}
                  isLoading={isLoading}
                  isDisabled={isDisabled}
                  issues={rowIssues.get(item.uid)}
                  onChange={(patch) =>
                    actions.updateItemField(fieldIndex, itemIndex, patch)
                  }
                  onRemove={() =>
                    actions.removeItemField(fieldIndex, itemIndex)
                  }
                />
              </SortableRow>
            ))}
          </SortableContext>

          <Stack flexDirection="row" spacing="spacingXs">
            <Button
              size="small"
              startIcon={<PlusIcon />}
              isDisabled={isDisabled}
              onClick={() => actions.addItemField(fieldIndex)}
            >
              Add item field
            </Button>
            <Button
              size="small"
              isDisabled={isDisabled || available.length === 0}
              onClick={() => actions.addAllItemFields(fieldIndex, available)}
            >
              Add all item fields
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
