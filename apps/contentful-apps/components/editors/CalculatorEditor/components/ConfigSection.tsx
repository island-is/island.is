import {
  Button,
  IconButton,
  Stack,
  Subheading,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'

import type {
  CalculatorFieldSection,
  CalculatorSectionToggle,
} from '@island.is/tax-calculators'

import { AvailableField, SectionActions } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'
import { SectionFieldRow } from './SectionFieldRow'
import { SectionToggleControl } from './SectionToggleControl'

interface Props {
  section: CalculatorFieldSection
  position: number
  availableFields: AvailableField[]
  isLoading: boolean
  otherToggles: CalculatorSectionToggle[]
  actions: SectionActions
}

export const ConfigSection = ({
  section,
  position,
  availableFields,
  isLoading,
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
        onClick={actions.remove}
      />
    </Stack>

    <LocalizedTextFields
      label="Section title"
      value={section.title}
      onChange={(next) => actions.update({ title: next })}
      clearWhenEmpty
    />
    <LocalizedTextFields
      label="Section description"
      value={section.description}
      onChange={(next) => actions.update({ description: next })}
      clearWhenEmpty
    />

    <SectionToggleControl
      toggle={section.toggle}
      gate={section.gate}
      otherToggles={otherToggles}
      onEnable={actions.enableToggle}
      onDisable={actions.disableToggle}
      onSelectGate={actions.setGate}
      onLabelChange={actions.setToggleLabel}
      onToggleDisableOnly={actions.toggleGateDisableOnly}
    />

    {section.fields.map((field, fieldIndex) => (
      <SectionFieldRow
        key={field.uid}
        field={field}
        availableFields={availableFields}
        isLoading={isLoading}
        onChange={(patch) => actions.updateField(fieldIndex, patch)}
        onRemove={() => actions.removeField(fieldIndex)}
      />
    ))}

    <Button size="small" startIcon={<PlusIcon />} onClick={actions.addField}>
      Add field
    </Button>
  </Stack>
)
