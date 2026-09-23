import {
  Button,
  Checkbox,
  IconButton,
  Stack,
  Subheading,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { DialogsAPI } from '@contentful/app-sdk'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { CalculatorOutputSection as OutputSectionModel } from '@island.is/tax-calculators'

import { OutputFieldContract, OutputSectionActions } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'
import { OutputContentRow } from './OutputContentRow'
import { OutputFieldRow } from './OutputFieldRow'
import { EmptyDropZone, SortableRow } from './SortableRow'

interface Props {
  section: OutputSectionModel
  position: number
  contract: OutputFieldContract
  isLoading: boolean
  isDisabled?: boolean
  rowIssues: Map<string, string[]>
  dialogs: DialogsAPI
  actions: OutputSectionActions
}

export const OutputSection = ({
  section,
  position,
  contract,
  isLoading,
  isDisabled,
  rowIssues,
  dialogs,
  actions,
}: Props) => {
  /* Accordion output requires a title. */
  const canBeAccordion = Boolean(section.title?.is?.trim())

  return (
    <Stack
      flexDirection="column"
      alignItems="stretch"
      spacing="spacingS"
      style={{ border: '1px solid #d3dce0', borderRadius: 6, padding: 16 }}
    >
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <Subheading marginBottom="none" style={{ flex: 1 }}>
          Output section {position}
        </Subheading>
        <IconButton
          aria-label="Remove output section"
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

      <Checkbox
        isChecked={section.variant === 'accordion'}
        isDisabled={isDisabled || !canBeAccordion}
        helpText={
          canBeAccordion ? undefined : 'Add a section title to use an accordion'
        }
        onChange={() =>
          actions.update({
            variant: section.variant === 'accordion' ? undefined : 'accordion',
          })
        }
      >
        Accordion
      </Checkbox>

      <SortableContext
        items={section.fields.map((field) => field.uid)}
        strategy={verticalListSortingStrategy}
      >
        <Stack flexDirection="column" alignItems="stretch" spacing="spacingXs">
          {section.fields.map((field, fieldIndex) => (
            <SortableRow
              key={field.uid}
              id={field.uid}
              label={`Reorder output field ${fieldIndex + 1} in section ${position}`}
              isDisabled={isDisabled}
            >
              {field.kind === 'content' ? (
                <OutputContentRow
                  field={field}
                  isDisabled={isDisabled}
                  issues={rowIssues.get(field.uid)}
                  dialogs={dialogs}
                  onChange={(content) =>
                    actions.updateField(fieldIndex, { content })
                  }
                  onRemove={() => actions.removeField(fieldIndex)}
                />
              ) : (
                <OutputFieldRow
                  field={field}
                  fieldIndex={fieldIndex}
                  contract={contract}
                  isLoading={isLoading}
                  isDisabled={isDisabled}
                  rowIssues={rowIssues}
                  actions={actions}
                />
              )}
            </SortableRow>
          ))}
          {section.fields.length === 0 && (
            <EmptyDropZone
              id={`output-empty-${section.key}`}
              label="Drag an output row here, or add one below"
            />
          )}
        </Stack>
      </SortableContext>

      <Stack flexDirection="row" spacing="spacingXs">
        <Button
          size="small"
          startIcon={<PlusIcon />}
          isDisabled={isDisabled}
          onClick={actions.addValueField}
        >
          Add output field
        </Button>
        <Button
          size="small"
          startIcon={<PlusIcon />}
          isDisabled={isDisabled}
          onClick={actions.addContentField}
        >
          Add content
        </Button>
      </Stack>
    </Stack>
  )
}
