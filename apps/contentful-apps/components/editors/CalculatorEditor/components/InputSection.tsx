import {
  Button,
  IconButton,
  Stack,
  Subheading,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type {
  CalculatorInputSection,
  CalculatorSectionToggle,
} from '@island.is/tax-calculators'

import { InputFieldContract, InputSectionActions } from '../types'
import { InputFieldRow } from './InputFieldRow'
import { LocalizedTextFields } from './LocalizedTextFields'
import { SectionToggleControl } from './SectionToggleControl'
import { EmptyDropZone, SortableRow } from './SortableRow'

interface Props {
  section: CalculatorInputSection
  position: number
  contract: InputFieldContract
  usedKeys: Set<string>
  isLoading: boolean
  isDisabled?: boolean
  rowIssues: Map<string, string[]>
  duplicateUids: Set<string>
  otherToggles: CalculatorSectionToggle[]
  actions: InputSectionActions
}

export const InputSection = ({
  section,
  position,
  contract,
  usedKeys,
  isLoading,
  isDisabled,
  rowIssues,
  duplicateUids,
  otherToggles,
  actions,
}: Props) => (
  <Stack
    flexDirection="column"
    alignItems="stretch"
    spacing="spacingS"
    style={{
      border: '1px solid #d3dce0',
      borderRadius: 6,
      padding: 16,
    }}
  >
    <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
      <Subheading marginBottom="none" style={{ flex: 1 }}>
        Section {position}
      </Subheading>
      <IconButton
        aria-label="Remove section"
        icon={<DeleteIcon />}
        isDisabled={isDisabled}
        onClick={actions.remove}
      />
    </Stack>

    <LocalizedTextFields
      label="Section title"
      value={section.title}
      isDisabled={isDisabled}
      onChange={(next) => actions.update({ title: next })}
      clearWhenEmpty
    />
    <LocalizedTextFields
      label="Section description"
      value={section.description}
      isDisabled={isDisabled}
      onChange={(next) => actions.update({ description: next })}
      clearWhenEmpty
    />

    <SectionToggleControl
      toggle={section.toggle}
      gate={section.gate}
      otherToggles={otherToggles}
      isDisabled={isDisabled}
      onEnable={actions.enableToggle}
      onDisable={actions.disableToggle}
      onSelectGate={actions.setGate}
      onLabelChange={actions.setToggleLabel}
      onToggleDisableOnly={actions.toggleGateDisableOnly}
    />

    <SortableContext
      items={section.fields.map((field) => field.uid)}
      strategy={verticalListSortingStrategy}
    >
      <Stack flexDirection="column" alignItems="stretch" spacing="spacingXs">
        {section.fields.map((field, fieldIndex) => (
          <SortableRow
            key={field.uid}
            id={field.uid}
            label={`Reorder field ${fieldIndex + 1} in section ${position}`}
            isDisabled={isDisabled}
          >
            <InputFieldRow
              field={field}
              contract={contract}
              usedKeys={usedKeys}
              isLoading={isLoading}
              isDisabled={isDisabled}
              issues={rowIssues.get(field.uid)}
              isDuplicate={duplicateUids.has(field.uid)}
              onChange={(patch) => actions.updateField(fieldIndex, patch)}
              onRemove={() => actions.removeField(fieldIndex)}
            />
          </SortableRow>
        ))}
        {section.fields.length === 0 && (
          <EmptyDropZone
            id={`input-empty-${section.key}`}
            label="Drag a field here, or add one below"
          />
        )}
      </Stack>
    </SortableContext>

    <Button
      size="small"
      startIcon={<PlusIcon />}
      isDisabled={isDisabled}
      onClick={actions.addField}
    >
      Add field
    </Button>
  </Stack>
)
