import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Tabs,
  Divider,
  Input,
  Tag,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { TranslationWorkspaceStatesNav } from '../TranslationWorkspaceStatesNav/TranslationWorkspaceStatesNav'
import * as styles from './TranslationWorkspaceStatesNavPanel.css'

export interface TranslationWorkspaceStatesNavPanelProps {
  states: TemplateStateNav[]
  selectedScreenId: string | undefined
  onNavClick: (nav: ScreenIntrospection, location: SidebarNavLocation) => void
  formatMessage: FormatMessage
  selectedScreen: ScreenIntrospection | null
  currentDescriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedForLocale: (messageKey: string) => string
  onValueChange: (messageKey: string, value: string) => void
}

const STRINGS_TAB_ID = 'strings'

export const TranslationWorkspaceStatesNavPanel = ({
  states,
  selectedScreenId,
  onNavClick,
  formatMessage,
  selectedScreen,
  currentDescriptors,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  onValueChange,
}: TranslationWorkspaceStatesNavPanelProps) => {
  const [activeTab, setActiveTab] = useState('states')

  useEffect(() => {
    if (selectedScreen) {
      setActiveTab(STRINGS_TAB_ID)
    }
  }, [selectedScreen?.id])

  const statesContent = (
    <Box className={styles.statesNavPanelScroll}>
      <Box className={styles.statesNavPanelInner}>
        <TranslationWorkspaceStatesNav
          states={states}
          selectedScreenId={selectedScreenId}
          onNavClick={onNavClick}
        />
      </Box>
    </Box>
  )

  const stringsContent = (
    <Box className={styles.statesNavPanelScroll}>
      <Box className={styles.statesNavPanelInner}>
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
                const currentValue =
                  draft ?? getPersistedForLocale(descriptor.id)
                const isDirty =
                  draft !== undefined &&
                  draft !== getPersistedForLocale(descriptor.id)

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
                      onChange={(e) =>
                        onValueChange(descriptor.id, e.target.value)
                      }
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

  const tabs = [
    { id: 'states', label: 'States', content: statesContent },
    {
      id: STRINGS_TAB_ID,
      label: `Strings${currentDescriptors.length ? ` (${currentDescriptors.length})` : ''}`,
      content: stringsContent,
    },
  ]

  return (
    <Box
      role="navigation"
      background="white"
      aria-label={formatMessage(m.translationStatesNavDrawerAriaLabel)}
      className={styles.statesNavPanelRoot}
    >
      <Tabs
        label="Translation workspace panel"
        tabs={tabs}
        selected={activeTab}
        onChange={setActiveTab}
        contentBackground="white"
        variant="alternative"
        size="sm"
      />
    </Box>
  )
}
