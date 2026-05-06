import { Box, Divider, Text } from '@island.is/island-ui/core'
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
}: TabsPanelStringsTabProps) => {
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
              <Text variant="small" color="dark300">
                {currentDescriptors.length} strings
              </Text>
            </Box>

            <Divider />

            <Box marginTop={3}>
              {currentDescriptors.map((descriptor) => {
                const draft = editedValues[activeLocale][descriptor.id]
                const persisted = getPersistedForLocale(descriptor.id)
                const currentValue = draft ?? persisted
                const isDirty = draft !== undefined && draft !== persisted

                return (
                  <TranslationDescriptorCard
                    key={descriptor.id}
                    descriptor={descriptor}
                    currentValue={currentValue}
                    isDirty={isDirty}
                    onValueChange={(value) =>
                      onValueChange(descriptor.id, value)
                    }
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

                    return (
                      <TranslationDescriptorCard
                        key={descriptor.id}
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
