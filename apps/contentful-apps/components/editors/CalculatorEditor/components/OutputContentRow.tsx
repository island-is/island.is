import { FormControl, IconButton, Stack } from '@contentful/f36-components'
import { DeleteIcon } from '@contentful/f36-icons'
import { DialogsAPI } from '@contentful/app-sdk'
import type { Node } from 'slate'

import type {
  CalculatorLocalizedMarkdown,
  CalculatorOutputContentField,
} from '@island.is/tax-calculators'

import { MarkdownEditor } from '../../../translation-namespace/components/MarkdownEditor'
import { unifyAndDeserialize } from '../../../translation-namespace/utils/deserialize'
import { serializeAndFormat } from '../../../translation-namespace/utils/serialize'

interface Props {
  field: CalculatorOutputContentField
  isDisabled?: boolean
  issues?: string[]
  dialogs: DialogsAPI
  onChange: (content: CalculatorLocalizedMarkdown) => void
  onRemove: () => void
}

const LOCALES: { id: 'is' | 'en'; label: string }[] = [
  { id: 'is', label: 'Content (Icelandic)' },
  { id: 'en', label: 'Content (English)' },
]

export const OutputContentRow = ({
  field,
  isDisabled,
  issues,
  dialogs,
  onChange,
  onRemove,
}: Props) => {
  const setLocale = (locale: 'is' | 'en', markdown: string) => {
    const trimmed = markdown.trim() ? markdown : ''
    onChange({
      is: locale === 'is' ? trimmed : field.content?.is ?? '',
      en: locale === 'en' ? trimmed : field.content?.en,
    })
  }

  return (
    <Stack
      flexDirection="column"
      alignItems="stretch"
      spacing="spacingXs"
      style={{ border: '1px solid #e5e8eb', borderRadius: 4, padding: 8 }}
    >
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <FormControl
          isRequired
          isInvalid={Boolean(issues?.length)}
          marginBottom="none"
          style={{ flex: 1 }}
        >
          <FormControl.Label>Content</FormControl.Label>
        </FormControl>
        <IconButton
          aria-label="Remove content"
          icon={<DeleteIcon />}
          isDisabled={isDisabled}
          onClick={onRemove}
        />
      </Stack>

      {LOCALES.map((locale) => (
        <FormControl key={locale.id} marginBottom="none">
          <FormControl.Label>{locale.label}</FormControl.Label>
          <MarkdownEditor
            /* Uncontrolled: it seeds state once and ignores the prop after
             * mount, so the key must pin it to this row and locale. */
            key={`${field.uid}-${locale.id}`}
            value={unifyAndDeserialize(field.content?.[locale.id])}
            dialogs={dialogs}
            readOnly={isDisabled}
            ariaLabel={locale.label}
            onChange={(value: Node[]) => {
              const serialized = serializeAndFormat(
                value as Parameters<typeof serializeAndFormat>[0],
              )
              /* `<Slate onChange>` fires on SELECTION changes too, so without
               * this a click into the editor would dirty a clean entry. */
              if (serialized === (field.content?.[locale.id] ?? '')) return
              setLocale(locale.id, serialized)
            }}
          />
        </FormControl>
      ))}

      {issues?.map((issue) => (
        <FormControl key={issue} isInvalid marginBottom="none">
          <FormControl.ValidationMessage>{issue}</FormControl.ValidationMessage>
        </FormControl>
      ))}
    </Stack>
  )
}
