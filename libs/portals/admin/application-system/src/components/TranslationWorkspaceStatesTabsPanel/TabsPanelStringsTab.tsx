import { useMemo } from 'react'
import cn from 'classnames'
import { Box, Text, ToggleSwitchButton } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import {
  getTranslationSourceText,
  type PersistedByKey,
} from '../../utils/translationWorkspaceEditing'
import { withCount } from '../../utils/translationWorkspaceNavPanel'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'
import { TranslationStringsList } from './TranslationStringsList'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

export interface TabsPanelStringsTabProps {
  selectedScreen: ScreenIntrospection | null
  visibleDescriptors: MessageDescriptor[]
  stringsListScope: 'screen' | 'application'
  onStringsListScopeChange: (scope: 'screen' | 'application') => void
  applicationStringCount: number
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  onLocaleChange: (locale: 'is' | 'en') => void
  getPersistedValue: (messageKey: string, locale: 'is' | 'en') => string
  onValueChange: (messageKey: string, value: string) => void
  showValidationErrors: boolean
  validationDescriptors: ValidationMessageDescriptor[]
  formatMessage: FormatMessage
  persistedByKey: PersistedByKey
  onGoogleTranslate?: (descriptorId: string, sourceText: string) => void
  onGoogleTranslateAll?: (
    items: Array<{ id: string; sourceText: string }>,
  ) => void
  translatingIds?: ReadonlySet<string>
}

export const TabsPanelStringsTab = ({
  selectedScreen,
  visibleDescriptors,
  stringsListScope,
  onStringsListScopeChange,
  applicationStringCount,
  editedValues,
  activeLocale,
  onLocaleChange,
  getPersistedValue,
  onValueChange,
  showValidationErrors,
  validationDescriptors,
  formatMessage,
  persistedByKey,
  onGoogleTranslate,
  onGoogleTranslateAll,
  translatingIds,
}: TabsPanelStringsTabProps) => {
  const visibleValidationDescriptors = useMemo(() => {
    if (!showValidationErrors) return []
    const ids = new Set(visibleDescriptors.map((d) => d.id))
    return validationDescriptors.filter((d) => !ids.has(d.id))
  }, [showValidationErrors, visibleDescriptors, validationDescriptors])

  const canShowScreenList = stringsListScope === 'screen' && selectedScreen
  const canShowApplicationList =
    stringsListScope === 'application' && applicationStringCount > 0

  const showMainList = canShowScreenList || canShowApplicationList
  const hasTranslatableContent =
    visibleDescriptors.length > 0 || visibleValidationDescriptors.length > 0

  return (
    <Box className={styles.tabsPanelScroll}>
      <Box className={styles.tabsPanelInner}>
        <Box marginBottom={3}>
          <Box
            role="group"
            background="blue100"
            borderColor="blue100"
            borderWidth="large"
            className={styles.scopeToggleList}
          >
            <Box
              component="button"
              type="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={cn(styles.scopeToggleOption, {
                [styles.scopeToggleOptionSelected]:
                  stringsListScope === 'screen',
              })}
              onClick={() => onStringsListScopeChange('screen')}
              aria-pressed={stringsListScope === 'screen'}
            >
              <Text
                variant="small"
                fontWeight={
                  stringsListScope === 'screen' ? 'semiBold' : 'light'
                }
                color={stringsListScope === 'screen' ? 'blue400' : 'dark400'}
                truncate
              >
                {formatMessage(m.translationStringsScopeScreen)}
              </Text>
            </Box>
            <Box
              component="button"
              type="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={cn(styles.scopeToggleOption, {
                [styles.scopeToggleOptionSelected]:
                  stringsListScope === 'application',
              })}
              onClick={() => onStringsListScopeChange('application')}
              aria-pressed={stringsListScope === 'application'}
            >
              <Text
                variant="small"
                fontWeight={
                  stringsListScope === 'application' ? 'semiBold' : 'light'
                }
                color={
                  stringsListScope === 'application' ? 'blue400' : 'dark400'
                }
                truncate
              >
                {withCount(
                  formatMessage(m.translationStringsScopeApplication),
                  applicationStringCount,
                )}
              </Text>
            </Box>
          </Box>
        </Box>

        {hasTranslatableContent && (
          <Box
            position="sticky"
            top={0}
            display="flex"
            alignItems="center"
            justifyContent="spaceBetween"
            columnGap={2}
            marginBottom={3}
            className={styles.localeStickyHeader}
          >
            <Text variant="medium" as="span">
              {formatMessage(m.translationEditIcelandicToggle)}
            </Text>
            <ToggleSwitchButton
              label={formatMessage(m.translationEditIcelandicToggle)}
              hiddenLabel
              checked={activeLocale === 'is'}
              onChange={(checked) => onLocaleChange(checked ? 'is' : 'en')}
              className={styles.toggleButton}
            />
          </Box>
        )}

        {showMainList && (
          <>
            <TranslationStringsList
              descriptors={visibleDescriptors}
              editedValues={editedValues}
              activeLocale={activeLocale}
              getPersistedValue={getPersistedValue}
              onValueChange={onValueChange}
              formatMessage={formatMessage}
              persistedByKey={persistedByKey}
              onGoogleTranslate={onGoogleTranslate}
              onGoogleTranslateAll={onGoogleTranslateAll}
              translatingIds={translatingIds}
              emptyMessage={
                stringsListScope === 'application'
                  ? formatMessage(m.translationStringsEmptyApplication)
                  : formatMessage(m.translationStringsEmptyScreen)
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
                  const sourceText = getTranslationSourceText(
                    descriptor,
                    editedValues,
                    persistedByKey,
                  )
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
                      onValueChange={(value) =>
                        onValueChange(descriptor.id, value)
                      }
                      tags={[
                        {
                          label: formatMessage(m.translationValidationErrorTag),
                          variant: 'rose',
                          outlined: true,
                        },
                      ]}
                      subtitle={formatMessage(
                        m.translationValidationFieldSubtitle,
                        { field: descriptor.fieldPath },
                      )}
                      onGoogleTranslate={
                        onGoogleTranslate && sourceText
                          ? () => onGoogleTranslate(descriptor.id, sourceText)
                          : undefined
                      }
                      isTranslating={translatingIds?.has(descriptor.id)}
                    />
                  )
                })}
              </Box>
            )}

            {showValidationErrors && validationDescriptors.length === 0 && (
              <Box marginTop={3}>
                <Text color="dark300">
                  {formatMessage(m.translationValidationEmpty)}
                </Text>
              </Box>
            )}
          </>
        )}

        {stringsListScope === 'screen' && !selectedScreen && (
          <Box marginTop={3}>
            <Text color="dark300">
              {formatMessage(m.translationStringsScreenSelectHint, {
                applicationScope: formatMessage(
                  m.translationStringsScopeApplication,
                ),
              })}
            </Text>
          </Box>
        )}

        {stringsListScope === 'application' && applicationStringCount === 0 && (
          <Box marginTop={3}>
            <Text color="dark300">
              {formatMessage(m.translationStringsApplicationEmptyHint)}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
