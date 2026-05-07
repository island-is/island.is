import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

export interface TabsPanelStringsTabProps {
  selectedScreen: ScreenIntrospection | null
  currentDescriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedForLocale: (messageKey: string) => string
  onValueChange: (messageKey: string, value: string) => void
  showValidationErrors: boolean
  validationDescriptors: ValidationMessageDescriptor[]
  formatMessage: FormatMessage
  persistedByKey: PersistedByKey
  onGoogleTranslate?: (descriptorId: string, sourceText: string) => void
  onGoogleTranslateAll?: (
    items: Array<{ id: string; sourceText: string }>,
  ) => void
  isTranslating?: boolean
}

export const TabsPanelStringsTab = ({
  selectedScreen,
  currentDescriptors,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  onValueChange,
  showValidationErrors,
  validationDescriptors,
  formatMessage,
  persistedByKey,
  onGoogleTranslate,
  onGoogleTranslateAll,
  isTranslating,
}: TabsPanelStringsTabProps) => {
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
    const allDescriptors = [
      ...currentDescriptors,
      ...(showValidationErrors ? validationDescriptors : []),
    ]
    const items = allDescriptors
      .map((d) => ({ id: d.id, sourceText: getSourceText(d) }))
      .filter((item) => item.sourceText)
    if (items.length > 0) {
      onGoogleTranslateAll(items)
    }
  }

  const showTranslateButtons = activeLocale === 'en' && !!onGoogleTranslate

  return (
    <Box className={styles.tabsPanelScroll}>
      <Box className={styles.tabsPanelInner}>
        {selectedScreen && (
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
                  {selectedScreen.title ?? selectedScreen.id}
                </Text>
              </Box>
              <Box display="flex" alignItems="center" columnGap={2}>
                <Text variant="small" color="dark300">
                  {currentDescriptors.length} strings
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
              {currentDescriptors.map((descriptor) => {
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
                    onValueChange={(value) =>
                      onValueChange(descriptor.id, value)
                    }
                    referenceLabel={referenceLabel}
                    referenceValue={getReferenceForDescriptor(descriptor)}
                    onGoogleTranslate={
                      showTranslateButtons && sourceText
                        ? () => onGoogleTranslate(descriptor.id, sourceText)
                        : undefined
                    }
                    isTranslating={isTranslating}
                  />
                )
              })}

              {currentDescriptors.length === 0 && !showValidationErrors && (
                <Box marginTop={3}>
                  <Text color="dark300">
                    No translatable strings found for this screen.
                  </Text>
                </Box>
              )}

              {showValidationErrors && validationDescriptors.length > 0 && (
                <Box marginTop={4}>
                  <Divider />
                  <Box marginTop={3} marginBottom={2}>
                    <Text variant="h5">
                      {formatMessage(m.translationValidationErrors)} (
                      {validationDescriptors.length})
                    </Text>
                  </Box>

                  {validationDescriptors.map((descriptor) => {
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
                        onValueChange={(value) =>
                          onValueChange(descriptor.id, value)
                        }
                        tags={[
                          { label: 'Error', variant: 'rose', outlined: true },
                        ]}
                        subtitle={`Field: ${descriptor.fieldPath}`}
                        referenceLabel={referenceLabel}
                        referenceValue={getReferenceForDescriptor(descriptor)}
                        onGoogleTranslate={
                          showTranslateButtons && sourceText
                            ? () => onGoogleTranslate(descriptor.id, sourceText)
                            : undefined
                        }
                        isTranslating={isTranslating}
                      />
                    )
                  })}
                </Box>
              )}

              {showValidationErrors && validationDescriptors.length === 0 && (
                <Box marginTop={3}>
                  <Text color="dark300">
                    No validation error messages found for this template.
                  </Text>
                </Box>
              )}
            </Box>
          </>
        )}

        {!selectedScreen && (
          <Box marginTop={3}>
            <Text color="dark300">
              Select a screen from the States tab to view its strings.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
