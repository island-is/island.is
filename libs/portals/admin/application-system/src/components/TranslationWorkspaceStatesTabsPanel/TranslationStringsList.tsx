import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type { EditedTranslations, MessageDescriptor } from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

export interface TranslationStringsListProps {
  heading: string
  descriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedForLocale: (messageKey: string) => string
  onValueChange: (messageKey: string, value: string) => void
  formatMessage: FormatMessage
  persistedByKey: PersistedByKey
  onGoogleTranslate?: (descriptorId: string, sourceText: string) => void
  onGoogleTranslateAll?: (
    items: Array<{ id: string; sourceText: string }>,
  ) => void
  isTranslating?: boolean
  emptyMessage?: string
}

export const TranslationStringsList = ({
  heading,
  descriptors,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  onValueChange,
  formatMessage,
  persistedByKey,
  onGoogleTranslate,
  onGoogleTranslateAll,
  isTranslating,
  emptyMessage,
}: TranslationStringsListProps) => {
  const getReferenceForDescriptor = (descriptor: MessageDescriptor) => {
    if (activeLocale === 'en') {
      const isEdited = editedValues.is[descriptor.id]
      const isPersisted = persistedByKey[descriptor.id]?.valueIs
      return isEdited || isPersisted || descriptor.defaultMessage || null
    }
    return descriptor.defaultMessage || null
  }

  const referenceLabel = activeLocale === 'en' ? 'Icelandic' : 'Default'

  const getSourceText = (descriptor: MessageDescriptor) => {
    return (
      editedValues.is[descriptor.id] ||
      persistedByKey[descriptor.id]?.valueIs ||
      descriptor.defaultMessage ||
      ''
    )
  }

  const handleTranslateAll = () => {
    if (!onGoogleTranslateAll) return
    const items = descriptors
      .map((descriptor) => ({
        id: descriptor.id,
        sourceText: getSourceText(descriptor),
      }))
      .filter((item) => item.sourceText)
    if (items.length > 0) {
      onGoogleTranslateAll(items)
    }
  }

  const showTranslateButtons = activeLocale === 'en' && !!onGoogleTranslate

  return (
    <>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
        columnGap={2}
      >
        <Box flexGrow={1} style={{ minWidth: 0 }}>
          <Text variant="h4" truncate>
            {heading}
          </Text>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Text variant="small" color="dark300">
            {descriptors.length} strings
          </Text>
          {showTranslateButtons && (
            <Button
              variant="ghost"
              type="button"
              size="small"
              preTextIcon="swapHorizontal"
              preTextIconType="outline"
              onClick={handleTranslateAll}
              disabled={isTranslating}
              loading={isTranslating}
            >
              {formatMessage(m.translationGoogleTranslateAll)}
            </Button>
          )}
        </Box>
      </Box>

      <Divider />

      <Box marginTop={6}>
        {descriptors.map((descriptor) => {
          const draft = editedValues[activeLocale][descriptor.id]
          const persisted = getPersistedForLocale(descriptor.id)
          const currentValue = draft ?? persisted
          const isDirty = draft !== undefined && draft !== persisted
          const sourceText = getSourceText(descriptor)

          return (
            <TranslationDescriptorCard
              key={descriptor.id}
              formatMessage={formatMessage}
              descriptor={descriptor}
              currentValue={currentValue}
              isDirty={isDirty}
              onValueChange={(value) => onValueChange(descriptor.id, value)}
              referenceLabel={referenceLabel}
              referenceValue={getReferenceForDescriptor(descriptor)}
              onGoogleTranslate={
                showTranslateButtons && sourceText && onGoogleTranslate
                  ? () => onGoogleTranslate(descriptor.id, sourceText)
                  : undefined
              }
              isTranslating={isTranslating}
            />
          )
        })}

        {descriptors.length === 0 && (
          <Box marginTop={3}>
            <Text color="dark300">
              {emptyMessage ?? 'No translatable strings found.'}
            </Text>
          </Box>
        )}
      </Box>
    </>
  )
}
