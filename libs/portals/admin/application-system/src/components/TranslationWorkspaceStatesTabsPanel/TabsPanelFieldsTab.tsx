import { useMemo } from 'react'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
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
import { TranslationDescriptorCard } from './TranslationDescriptorCard'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

export interface TabsPanelFieldsTabProps {
  focusableFields: ScreenIntrospection[]
  focusedIndex: number
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedForLocale: (messageKey: string) => string
  onValueChange: (messageKey: string, value: string) => void
  validationDescriptorsByPath: Record<string, ValidationMessageDescriptor[]>
  fieldErrorOverrides: Set<string>
  onToggleFieldError: (fieldId: string) => void
  onSetPreviewFieldValue: (fieldId: string, value: string) => void
  onFocusedFieldChange: (fieldId: string | null) => void
  formatMessage: FormatMessage
}

export const TabsPanelFieldsTab = ({
  focusableFields,
  focusedIndex,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  onValueChange,
  validationDescriptorsByPath,
  fieldErrorOverrides,
  onToggleFieldError,
  onSetPreviewFieldValue,
  onFocusedFieldChange,
  formatMessage,
}: TabsPanelFieldsTabProps) => {
  const currentField = focusableFields[focusedIndex] ?? null

  const currentFieldProperties = useMemo(
    () =>
      currentField
        ? getFieldProperties(currentField, validationDescriptorsByPath)
        : [],
    [currentField, validationDescriptorsByPath],
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
              <Text variant="small" color="dark300">
                {focusedIndex + 1} / {focusableFields.length}
              </Text>
            </Box>

            <Box marginBottom={2}>
              <Text variant="eyebrow" color="dark300" truncate>
                {currentField.id}
              </Text>
            </Box>

            <Divider />

            <Box marginTop={3}>
              {currentFieldProperties.map((prop) => {
                if (!prop.descriptor) return null
                const descriptor = prop.descriptor
                const draft = editedValues[activeLocale][descriptor.id]
                const persisted = getPersistedForLocale(descriptor.id)
                const currentValue = draft ?? persisted
                const isDirty = draft !== undefined && draft !== persisted

                return (
                  <TranslationDescriptorCard
                    key={`${prop.role}-${descriptor.id}`}
                    descriptor={descriptor}
                    currentValue={currentValue}
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
                  />
                )
              })}

              {currentFieldProperties.length === 0 && (
                <Box marginTop={2}>
                  <Text color="dark300" variant="small">
                    No translatable properties for this field.
                  </Text>
                </Box>
              )}
            </Box>

            {currentField.type !== 'DESCRIPTION' && currentField.type !== 'ALERT_MESSAGE' && (
              <Box display="flex" columnGap={2} marginTop={2} marginBottom={3}>
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
