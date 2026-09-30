import { useMemo } from 'react'
import {
  Box,
  Button,
  Divider,
  Icon,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import {
  generatePreviewValueForField,
  getFieldProperties,
} from '../../utils/translationWorkspaceNavPanel'
import { isTranslatingEveryId } from '../../utils/translationWorkspaceEditing'
import { TranslationDescriptorCard } from './TranslationDescriptorCard'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

export interface TabsPanelFieldsTabProps {
  focusableFields: ScreenIntrospection[]
  focusedIndex: number
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedForLocale: (messageKey: string) => string
  getPersistedValue: (messageKey: string, locale: 'is' | 'en') => string
  onValueChange: (messageKey: string, value: string) => void
  validationDescriptorsByPath: Record<string, ValidationMessageDescriptor[]>
  fieldErrorOverrides: Set<string>
  onToggleFieldError: (fieldId: string) => void
  onSetPreviewFieldValue: (fieldId: string, value: string) => void
  onFocusedFieldChange: (fieldId: string | null) => void
  formatMessage: FormatMessage
  persistedByKey: PersistedByKey
  onGoogleTranslate?: (descriptorId: string, sourceText: string) => void
  onGoogleTranslateAll?: (
    items: Array<{ id: string; sourceText: string }>,
  ) => void
  translatingIds?: ReadonlySet<string>
  ownedNamespaces?: readonly string[]
}

export const TabsPanelFieldsTab = ({
  focusableFields,
  focusedIndex,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  getPersistedValue,
  onValueChange,
  validationDescriptorsByPath,
  fieldErrorOverrides,
  onToggleFieldError,
  onSetPreviewFieldValue,
  onFocusedFieldChange,
  formatMessage,
  persistedByKey,
  onGoogleTranslate,
  onGoogleTranslateAll,
  translatingIds,
  ownedNamespaces = [],
}: TabsPanelFieldsTabProps) => {
  const showTranslateButtons = activeLocale === 'en' && !!onGoogleTranslate

  const getSourceText = (descriptor: {
    id: string
    defaultMessage?: string | null
  }) => {
    return (
      editedValues.is[descriptor.id] ||
      persistedByKey[descriptor.id]?.valueIs ||
      descriptor.defaultMessage ||
      ''
    )
  }

  const currentField = focusableFields[focusedIndex] ?? null

  const currentFieldProperties = useMemo(
    () =>
      currentField
        ? getFieldProperties(
            currentField,
            validationDescriptorsByPath,
            formatMessage,
            ownedNamespaces,
          )
        : [],
    [currentField, validationDescriptorsByPath, formatMessage, ownedNamespaces],
  )

  const translatablePropertyIds = currentFieldProperties
    .filter((p) => p.descriptor && getSourceText(p.descriptor))
    .map((p) => p.descriptor!.id)
  const isTranslatingAll = isTranslatingEveryId(
    translatablePropertyIds,
    translatingIds,
  )

  const handleAutofill = () => {
    if (!currentField) return
    onSetPreviewFieldValue(
      currentField.id,
      generatePreviewValueForField(currentField),
    )
  }

  const handlePrev = () => {
    if (focusedIndex > 0) {
      onFocusedFieldChange(focusableFields[focusedIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (focusedIndex < focusableFields.length - 1) {
      onFocusedFieldChange(focusableFields[focusedIndex + 1].id)
    }
  }

  return (
    <Box className={styles.tabsPanelScroll}>
      <Box className={styles.tabsPanelInner}>
        {focusableFields.length === 0 && (
          <Box marginTop={3}>
            <Text color="dark300">
              {formatMessage(m.translationFieldNoFields)}
            </Text>
          </Box>
        )}

        {currentField && (
          <>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={2}
              columnGap={2}
            >
              <Box flexGrow={1} style={{ minWidth: 0 }}>
                <Text variant="h4" truncate>
                  {currentField.type}
                </Text>
              </Box>
              <Box display="flex" alignItems="center" columnGap={2}>
                <Text variant="small" color="dark300">
                  {focusedIndex + 1} / {focusableFields.length}
                </Text>
                {showTranslateButtons && currentFieldProperties.length > 0 && (
                  <Box display="flex" alignItems="center" columnGap={1}>
                    <Button
                      variant="text"
                      type="button"
                      size="small"
                      icon="translate"
                      onClick={() => {
                        if (!onGoogleTranslateAll) return
                        const items = currentFieldProperties
                          .filter((p) => p.descriptor)
                          .map((p) => ({
                            id: p.descriptor!.id,
                            sourceText: getSourceText(p.descriptor!),
                          }))
                          .filter((item) => item.sourceText)
                        if (items.length > 0) {
                          onGoogleTranslateAll(items)
                        }
                      }}
                      disabled={isTranslatingAll}
                      loading={isTranslatingAll}
                    >
                      {formatMessage(m.translationGoogleTranslateAll)}
                    </Button>
                    <Tooltip
                      text={formatMessage(
                        m.translationGoogleTranslateAllTooltip,
                      )}
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
              </Box>
            </Box>

            <Divider />

            <Box marginTop={6}>
              {currentFieldProperties.map((prop) => {
                if (!prop.descriptor) return null
                const descriptor = prop.descriptor
                const draft = editedValues[activeLocale][descriptor.id]
                const persisted = getPersistedForLocale(descriptor.id)
                const isDirty = draft !== undefined && draft !== persisted
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
                    key={`${prop.role}-${descriptor.id}`}
                    formatMessage={formatMessage}
                    descriptor={descriptor}
                    icelandicValue={icelandicValue}
                    translationValue={translationValue}
                    activeLocale={activeLocale}
                    isDirty={isDirty}
                    onValueChange={(value) =>
                      onValueChange(descriptor.id, value)
                    }
                    tags={[
                      {
                        label: prop.label,
                        variant: prop.role === 'error' ? 'rose' : 'blue',
                      },
                    ]}
                    onGoogleTranslate={
                      showTranslateButtons && sourceText
                        ? () => onGoogleTranslate(descriptor.id, sourceText)
                        : undefined
                    }
                    isTranslating={translatingIds?.has(descriptor.id)}
                  />
                )
              })}

              {currentFieldProperties.length === 0 && (
                <Box marginTop={2}>
                  <Text color="dark300" variant="small">
                    {formatMessage(m.translationFieldNoProperties)}
                  </Text>
                </Box>
              )}
            </Box>

            {currentField.type !== 'DESCRIPTION' &&
              currentField.type !== 'ALERT_MESSAGE' && (
                <Box
                  display="flex"
                  columnGap={2}
                  marginTop={2}
                  marginBottom={3}
                >
                  <Button
                    variant="ghost"
                    size="small"
                    type="button"
                    onClick={handleAutofill}
                  >
                    {formatMessage(m.translationFieldAutofill)}
                  </Button>
                  <Button
                    variant={
                      fieldErrorOverrides.has(currentField.id)
                        ? 'primary'
                        : 'ghost'
                    }
                    size="small"
                    type="button"
                    colorScheme={
                      fieldErrorOverrides.has(currentField.id)
                        ? 'destructive'
                        : 'default'
                    }
                    onClick={() => onToggleFieldError(currentField.id)}
                  >
                    {formatMessage(m.translationFieldShowError)}
                  </Button>
                </Box>
              )}

            <Divider />

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginTop={6}
              paddingBottom={2}
            >
              <Button
                variant="ghost"
                size="small"
                type="button"
                icon="arrowBack"
                disabled={focusedIndex <= 0}
                onClick={handlePrev}
              >
                {formatMessage(m.translationFieldPrevious)}
              </Button>
              <Button
                variant="ghost"
                size="small"
                type="button"
                icon="arrowForward"
                iconType="filled"
                disabled={focusedIndex >= focusableFields.length - 1}
                onClick={handleNext}
              >
                {formatMessage(m.translationFieldNext)}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
