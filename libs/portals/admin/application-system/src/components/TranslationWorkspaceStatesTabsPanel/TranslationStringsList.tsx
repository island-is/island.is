import {
  Box,
  Button,
  Icon,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { isTranslatingEveryId } from '../../utils/translationWorkspaceEditing'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

export interface TranslationStringsListProps {
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
  translatingIds?: ReadonlySet<string>
  emptyMessage?: string
}

export const TranslationStringsList = ({
  descriptors,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  onValueChange,
  formatMessage,
  persistedByKey,
  onGoogleTranslate,
  onGoogleTranslateAll,
  translatingIds,
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

  const referenceLabel =
    activeLocale === 'en'
      ? formatMessage(m.translationReferenceLabelIcelandic)
      : formatMessage(m.translationReferenceLabelDefault)

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
  const translatableIds = descriptors
    .filter((descriptor) => getSourceText(descriptor))
    .map((descriptor) => descriptor.id)
  const isTranslatingAll = isTranslatingEveryId(translatableIds, translatingIds)

  return (
    <>
      {showTranslateButtons && (
        <Box display="flex" alignItems="center" columnGap={1} marginBottom={1}>
          <Button
            variant="text"
            type="button"
            size="small"
            icon="translate"
            onClick={handleTranslateAll}
            disabled={isTranslatingAll}
            loading={isTranslatingAll}
          >
            {formatMessage(m.translationGoogleTranslateAll)}
          </Button>
          <Tooltip
            text={formatMessage(m.translationGoogleTranslateAllTooltip)}
            placement="top"
          >
            <span>
              <Icon
                icon="informationCircle"
                size="small"
                type="outline"
                color="dark300"
              />
            </span>
          </Tooltip>
        </Box>
      )}

      <Box marginTop={2}>
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
              isTranslating={translatingIds?.has(descriptor.id)}
            />
          )
        })}

        {descriptors.length === 0 && (
          <Box marginTop={3}>
            <Text color="dark300">
              {emptyMessage ?? formatMessage(m.translationStringsListEmpty)}
            </Text>
          </Box>
        )}
      </Box>
    </>
  )
}
