import { Box, Button, Icon, Text, Tooltip } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { isTranslatingEveryId } from '../../utils/translationWorkspaceEditing'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

export interface TranslationStringsListProps {
  descriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedValue: (messageKey: string, locale: 'is' | 'en') => string
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
  getPersistedValue,
  onValueChange,
  formatMessage,
  persistedByKey,
  onGoogleTranslate,
  onGoogleTranslateAll,
  translatingIds,
  emptyMessage,
}: TranslationStringsListProps) => {
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
      {onGoogleTranslate && (
        <Box
          display="flex"
          alignItems="center"
          columnGap={1}
          marginBottom={1}
          className={
            !showTranslateButtons ? styles.translateActionDisabled : undefined
          }
        >
          <Button
            variant="text"
            type="button"
            size="small"
            icon="translate"
            onClick={handleTranslateAll}
            disabled={!showTranslateButtons || isTranslatingAll}
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
          const sourceText = getSourceText(descriptor)
          const icelandicValue =
            editedValues.is[descriptor.id] ??
            getPersistedValue(descriptor.id, 'is') ??
            descriptor.defaultMessage ??
            ''
          const translationValue =
            editedValues.en[descriptor.id] ??
            getPersistedValue(descriptor.id, 'en') ??
            ''

          return (
            <TranslationDescriptorCard
              key={descriptor.id}
              formatMessage={formatMessage}
              descriptor={descriptor}
              icelandicValue={icelandicValue}
              translationValue={translationValue}
              activeLocale={activeLocale}
              onValueChange={(value) => onValueChange(descriptor.id, value)}
              onGoogleTranslate={
                sourceText && onGoogleTranslate
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
