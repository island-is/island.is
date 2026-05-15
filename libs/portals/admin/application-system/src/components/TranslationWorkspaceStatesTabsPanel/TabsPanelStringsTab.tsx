import { useMemo } from 'react'
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
  visibleDescriptors: MessageDescriptor[]
  stringsListScope: 'screen' | 'application'
  onStringsListScopeChange: (scope: 'screen' | 'application') => void
  applicationStringCount: number
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
  visibleDescriptors,
  stringsListScope,
  onStringsListScopeChange,
  applicationStringCount,
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
  const visibleValidationDescriptors = useMemo(() => {
    if (!showValidationErrors) return []
    const ids = new Set(visibleDescriptors.map((d) => d.id))
    return validationDescriptors.filter((d) => !ids.has(d.id))
  }, [showValidationErrors, visibleDescriptors, validationDescriptors])

  const descriptorsForBulkTranslate = useMemo(() => {
    const byId = new Map<string, MessageDescriptor>()
    for (const d of visibleDescriptors) {
      byId.set(d.id, d)
    }
    for (const v of visibleValidationDescriptors) {
      byId.set(v.id, v)
    }
    return [...byId.values()]
  }, [visibleDescriptors, visibleValidationDescriptors])

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
    const items = descriptorsForBulkTranslate
      .map((d) => ({ id: d.id, sourceText: getSourceText(d) }))
      .filter((item) => item.sourceText)
    if (items.length > 0) {
      onGoogleTranslateAll(items)
    }
  }

  const showTranslateButtons = activeLocale === 'en' && !!onGoogleTranslate

  const canShowScreenList = stringsListScope === 'screen' && selectedScreen
  const canShowApplicationList =
    stringsListScope === 'application' && applicationStringCount > 0

  const showMainList = canShowScreenList || canShowApplicationList

  const listHeading =
    stringsListScope === 'application'
      ? formatMessage(m.translationStringsAllApplicationHeading)
      : selectedScreen
        ? selectedScreen.title ?? selectedScreen.id
        : ''

  const descriptorCount =
    visibleDescriptors.length + visibleValidationDescriptors.length

  const renderDescriptorList = (descriptors: MessageDescriptor[]) =>
    descriptors.map((descriptor) => {
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
            showTranslateButtons && sourceText
              ? () => onGoogleTranslate(descriptor.id, sourceText)
              : undefined
          }
          isTranslating={isTranslating}
        />
      )
    })

  return (
    <Box className={styles.tabsPanelScroll}>
      <Box className={styles.tabsPanelInner}>
        <Box marginBottom={3}>
          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            <Button
              type="button"
              size="small"
              variant={
                stringsListScope === 'screen' ? 'primary' : 'ghost'
              }
              onClick={() => onStringsListScopeChange('screen')}
              aria-pressed={stringsListScope === 'screen'}
            >
              {formatMessage(m.translationStringsScopeScreen)}
            </Button>
            <Button
              type="button"
              size="small"
              variant={
                stringsListScope === 'application' ? 'primary' : 'ghost'
              }
              onClick={() => onStringsListScopeChange('application')}
              aria-pressed={stringsListScope === 'application'}
            >
              {formatMessage(m.translationStringsScopeApplication)}
            </Button>
          </Box>
        </Box>

        {showMainList && (
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
                  {listHeading}
                </Text>
              </Box>
              <Box display="flex" alignItems="center" columnGap={2}>
                <Text variant="small" color="dark300">
                  {descriptorCount} strings
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
              {renderDescriptorList(visibleDescriptors)}

              {visibleDescriptors.length === 0 &&
                !(showValidationErrors && visibleValidationDescriptors.length > 0) && (
                  <Box marginTop={3}>
                    <Text color="dark300">
                      {stringsListScope === 'application'
                        ? 'No translatable strings found for this application template.'
                        : 'No translatable strings found for this screen.'}
                    </Text>
                  </Box>
                )}

              {visibleValidationDescriptors.length > 0 && (
                <Box marginTop={4}>
                  <Divider />
                  <Box marginTop={3} marginBottom={2}>
                    <Text variant="h5">
                      {formatMessage(m.translationValidationErrors)} (
                      {visibleValidationDescriptors.length})
                    </Text>
                  </Box>

                  {visibleValidationDescriptors.map((descriptor) => {
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
                            ? () =>
                                onGoogleTranslate(descriptor.id, sourceText)
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

        {stringsListScope === 'screen' && !selectedScreen && (
          <Box marginTop={3}>
            <Text color="dark300">
              Select a screen from the States tab to view its strings, or view
              every string in the template using{' '}
              {formatMessage(m.translationStringsScopeApplication)}.
            </Text>
          </Box>
        )}

        {stringsListScope === 'application' &&
          applicationStringCount === 0 && (
            <Box marginTop={3}>
              <Text color="dark300">
                No translatable strings were reported for this application
                template.
              </Text>
            </Box>
          )}
      </Box>
    </Box>
  )
}
