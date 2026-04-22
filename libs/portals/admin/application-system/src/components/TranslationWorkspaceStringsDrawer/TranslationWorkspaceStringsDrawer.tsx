import {
  Box,
  Text,
  Button,
  Drawer,
  Divider,
  Input,
  Tag,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import * as translationWorkspaceDrawer from '../../screens/TranslationWorkspace/TranslationWorkspace.stringsDrawer.css'

export interface TranslationWorkspaceStringsDrawerProps {
  selectedScreen: ScreenIntrospection
  stringsDrawerOpen: boolean
  onStringsDrawerVisibilityChange: (open: boolean) => void
  currentDescriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  getPersistedForLocale: (messageKey: string) => string
  onValueChange: (messageKey: string, value: string) => void
  formatMessage: FormatMessage
}

export const TranslationWorkspaceStringsDrawer = ({
  selectedScreen,
  stringsDrawerOpen,
  onStringsDrawerVisibilityChange,
  currentDescriptors,
  editedValues,
  getPersistedForLocale,
  onValueChange,
  formatMessage,
}: TranslationWorkspaceStringsDrawerProps) => (
  <>
    {!stringsDrawerOpen && (
      <Box position="fixed" right={0} zIndex={90} style={{ top: '32%' }}>
        <Button
          variant="ghost"
          size="small"
          icon="chevronBack"
          aria-label={formatMessage(m.translationStringsDrawerShow)}
          onClick={() => onStringsDrawerVisibilityChange(true)}
        />
      </Box>
    )}

    <Drawer
      ariaLabel={formatMessage(m.translationStringsDrawerAriaLabel)}
      baseId="translation-workspace-strings-drawer"
      position="right"
      isVisible={stringsDrawerOpen}
      onVisibilityChange={onStringsDrawerVisibilityChange}
      backdropTransparent
      hideOnClickOutside={false}
      preventBodyScroll={false}
      panelClassName={translationWorkspaceDrawer.stringsDrawerPanel}
    >
      <Box marginTop={5}>
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
          <Box
            display="flex"
            alignItems="center"
            flexShrink={0}
            columnGap={2}
          >
            <Text variant="small" color="dark300">
              {currentDescriptors.length} strings
            </Text>
            <Button
              variant="ghost"
              size="small"
              icon="chevronForward"
              aria-label={formatMessage(m.translationStringsDrawerCollapse)}
              onClick={() => onStringsDrawerVisibilityChange(false)}
            />
          </Box>
        </Box>

        <Divider />

        <Box marginTop={3}>
          {currentDescriptors.map((descriptor) => {
            const currentValue =
              editedValues[descriptor.id] ??
              getPersistedForLocale(descriptor.id)
            const isDirty =
              editedValues[descriptor.id] !== undefined &&
              editedValues[descriptor.id] !==
                getPersistedForLocale(descriptor.id)

            return (
              <Box
                key={descriptor.id}
                marginBottom={3}
                padding={2}
                borderRadius="standard"
                border={isDirty ? 'focus' : 'standard'}
              >
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  marginBottom={1}
                >
                  <Text variant="eyebrow" color="dark300">
                    {descriptor.id}
                  </Text>
                  {isDirty && (
                    <Tag variant="blueberry" outlined>
                      Unsaved
                    </Tag>
                  )}
                </Box>

                <Box marginBottom={1}>
                  <Text variant="small" color="dark400">
                    Default: {descriptor.defaultMessage ?? '—'}
                  </Text>
                </Box>

                <Input
                  name={`translation-${descriptor.id}`}
                  size="sm"
                  value={currentValue}
                  onChange={(e) => onValueChange(descriptor.id, e.target.value)}
                  textarea={(descriptor.defaultMessage?.length ?? 0) > 80}
                  rows={3}
                />
              </Box>
            )
          })}

          {currentDescriptors.length === 0 && (
            <Box marginTop={3}>
              <Text color="dark300">
                No translatable strings found for this screen.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  </>
)
