import type { Node } from 'slate'
import { DialogsAPI } from '@contentful/app-sdk'
import {
  FormControl,
  IconButton,
  Stack,
  Text,
} from '@contentful/f36-components'
import { DeleteIcon } from '@contentful/f36-icons'

import type {
  CalculatorInputContentField,
  CalculatorLocalizedMarkdown,
  CalculatorOutputContentField,
} from '@island.is/tax-calculators'

import { MarkdownEditor } from '../../../translation-namespace/components/MarkdownEditor'
import { unifyAndDeserialize } from '../../../translation-namespace/utils/deserialize'
import { serializeAndFormat } from '../../../translation-namespace/utils/serialize'
import { isBlankMarkdown } from '../utils'
import * as styles from './CalculatorEditor.css'

interface Props {
  field: CalculatorOutputContentField | CalculatorInputContentField
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

export const ContentRow = ({
  field,
  isDisabled,
  issues,
  dialogs,
  onChange,
  onRemove,
}: Props) => {
  const setLocale = (locale: 'is' | 'en', markdown: string) => {
    const trimmed = isBlankMarkdown(markdown) ? '' : markdown
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
      className={styles.fieldRow}
    >
      <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
        <Text fontWeight="fontWeightMedium" className={styles.grow}>
          Content
        </Text>
        <IconButton
          aria-label="Remove content"
          icon={<DeleteIcon />}
          isDisabled={isDisabled}
          onClick={onRemove}
        />
      </Stack>

      {isBlankMarkdown(field.content?.is) && (
        <Text fontColor="gray600" fontSize="fontSizeS">
          This row isn&apos;t saved until it has Icelandic content.
        </Text>
      )}

      {LOCALES.map((locale) => (
        <FormControl key={locale.id} marginBottom="none">
          <FormControl.Label>{locale.label}</FormControl.Label>
          <MarkdownEditor
            /* Remounts the uncontrolled editor for each row and locale. */
            key={`${field.uid}-${locale.id}`}
            value={unifyAndDeserialize(field.content?.[locale.id])}
            dialogs={dialogs}
            readOnly={isDisabled}
            ariaLabel={locale.label}
            onChange={(value: Node[]) => {
              const serialized = serializeAndFormat(
                value as Parameters<typeof serializeAndFormat>[0],
              )
              /* Ignores Slate selection changes. */
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
