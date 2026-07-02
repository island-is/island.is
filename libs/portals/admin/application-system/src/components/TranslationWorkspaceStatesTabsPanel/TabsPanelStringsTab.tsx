import { useMemo } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'
import { TranslationStringsList } from './TranslationStringsList'
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

  return (
    <Box className={styles.tabsPanelScroll}>
      <Box className={styles.tabsPanelInner}>
        <Box marginBottom={3}>
          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            <Button
              type="button"
              size="small"
              variant={stringsListScope === 'screen' ? 'primary' : 'ghost'}
              onClick={() => onStringsListScopeChange('screen')}
              aria-pressed={stringsListScope === 'screen'}
            >
              {formatMessage(m.translationStringsScopeScreen)}
            </Button>
            <Button
              type="button"
              size="small"
              variant={stringsListScope === 'application' ? 'primary' : 'ghost'}
              onClick={() => onStringsListScopeChange('application')}
              aria-pressed={stringsListScope === 'application'}
            >
              {formatMessage(m.translationStringsScopeApplication)}
            </Button>
          </Box>
        </Box>

        {showMainList && (
          <>
            <TranslationStringsList
              heading={listHeading}
              descriptors={visibleDescriptors}
              editedValues={editedValues}
              activeLocale={activeLocale}
              getPersistedForLocale={getPersistedForLocale}
              onValueChange={onValueChange}
              formatMessage={formatMessage}
              persistedByKey={persistedByKey}
              onGoogleTranslate={onGoogleTranslate}
              onGoogleTranslateAll={onGoogleTranslateAll}
              isTranslating={isTranslating}
              emptyMessage={
                stringsListScope === 'application'
                  ? 'No translatable strings found for this application template.'
                  : 'No translatable strings found for this screen.'
              }
            />

            {visibleValidationDescriptors.length > 0 && (
              <Box marginTop={4}>
                <Box marginBottom={2}>
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
                          ? () => onGoogleTranslate!(descriptor.id, sourceText)
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

        {stringsListScope === 'application' && applicationStringCount === 0 && (
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
