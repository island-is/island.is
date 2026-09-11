import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Stack,
  Subheading,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { DialogsAPI } from '@contentful/app-sdk'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Node } from 'slate'

import type {
  CalculatorLocalizedMarkdown,
  CalculatorOutputSection as OutputSectionModel,
} from '@island.is/tax-calculators'

import { MarkdownEditor } from '../../../translation-namespace/components/MarkdownEditor'
import { unifyAndDeserialize } from '../../../translation-namespace/utils/deserialize'
import { serializeAndFormat } from '../../../translation-namespace/utils/serialize'
import { OutputFieldContract, OutputSectionActions } from '../types'
import { LocalizedTextFields } from './LocalizedTextFields'
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

const LOCALES: { id: 'is' | 'en'; label: string }[] = [
  { id: 'is', label: 'Content (Icelandic)' },
  { id: 'en', label: 'Content (English)' },
]

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
  /* The schema rejects an accordion without a title, so the control is blocked
   * rather than allowed to invalidate the document. The filter drops the
   * variant too, for the author who ticks this and then clears the title. */
  const canBeAccordion = Boolean(section.title?.is?.trim())

  const setLocaleContent = (locale: 'is' | 'en', markdown: string) => {
    const trimmed = markdown.trim() ? markdown : ''
    const next: CalculatorLocalizedMarkdown = {
      is: locale === 'is' ? trimmed : section.content?.is ?? '',
      en: locale === 'en' ? trimmed : section.content?.en,
    }
    actions.setContent(next.is || next.en ? next : undefined)
  }

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

      {LOCALES.map((locale) => (
        <FormControl key={locale.id} marginBottom="none">
          <FormControl.Label>{locale.label}</FormControl.Label>
          <MarkdownEditor
            /* Uncontrolled: it seeds state once and ignores the prop after
             * mount, so the key must pin it to this section and locale. */
            key={`${section.key}-${locale.id}`}
            value={unifyAndDeserialize(section.content?.[locale.id])}
            dialogs={dialogs}
            readOnly={isDisabled}
            ariaLabel={locale.label}
            onChange={(value: Node[]) => {
              const serialized = serializeAndFormat(
                value as Parameters<typeof serializeAndFormat>[0],
              )
              /* `<Slate onChange>` fires on SELECTION changes too, so without
               * this a click into the editor would dirty a clean entry. */
              if (serialized === (section.content?.[locale.id] ?? '')) return
              setLocaleContent(locale.id, serialized)
            }}
          />
        </FormControl>
      ))}

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
              <OutputFieldRow
                field={field}
                fieldIndex={fieldIndex}
                contract={contract}
                isLoading={isLoading}
                isDisabled={isDisabled}
                rowIssues={rowIssues}
                actions={actions}
              />
            </SortableRow>
          ))}
          {section.fields.length === 0 && (
            <EmptyDropZone
              id={`output-empty-${section.key}`}
              label="Drag an output field here, or add one below"
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
        Add output field
      </Button>
    </Stack>
  )
}
