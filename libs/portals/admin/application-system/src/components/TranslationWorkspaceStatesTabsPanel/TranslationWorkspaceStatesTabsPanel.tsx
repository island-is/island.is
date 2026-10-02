import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import cn from 'classnames'
import { Box, Text } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { TranslationWorkspaceStatesNav } from '../TranslationWorkspaceStatesNav/TranslationWorkspaceStatesNav'
import {
  STATES_TAB_ID,
  STRINGS_TAB_ID,
} from '../../utils/translationWorkspaceNavPanel'
import { TabsPanelStringsTab } from './TabsPanelStringsTab'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

export interface TranslationWorkspaceStatesTabsPanelProps {
  states: TemplateStateNav[]
  selectedLocation: SidebarNavLocation | null
  onNavClick: (nav: ScreenIntrospection, location: SidebarNavLocation) => void
  formatMessage: FormatMessage
  selectedScreen: ScreenIntrospection | null
  screenMessageDescriptors: MessageDescriptor[]
  allApplicationMessageDescriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  onLocaleChange: (locale: 'is' | 'en') => void
  getPersistedValue: (messageKey: string, locale: 'is' | 'en') => string
  onValueChange: (messageKey: string, value: string) => void
  showValidationErrors: boolean
  validationDescriptors: ValidationMessageDescriptor[]
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>
  onActiveTabChange?: (tab: string) => void
  onGoogleTranslate?: (descriptorId: string, sourceText: string) => void
  onGoogleTranslateAll?: (
    items: Array<{ id: string; sourceText: string }>,
  ) => void
  translatingIds?: ReadonlySet<string>
  ownedNamespaces?: readonly string[]
}

const withCount = (label: string, count: number) =>
  count > 0 ? `${label} (${count})` : label

export const TranslationWorkspaceStatesTabsPanel = ({
  states,
  selectedLocation,
  onNavClick,
  formatMessage,
  selectedScreen,
  screenMessageDescriptors,
  allApplicationMessageDescriptors,
  editedValues,
  activeLocale,
  onLocaleChange,
  getPersistedValue,
  onValueChange,
  showValidationErrors,
  validationDescriptors,
  persistedByKey,
  onActiveTabChange,
  onGoogleTranslate,
  onGoogleTranslateAll,
  translatingIds,
  ownedNamespaces = [],
}: TranslationWorkspaceStatesTabsPanelProps) => {
  const [activeTab, setActiveTabRaw] = useState(STATES_TAB_ID)
  const [stringsListScope, setStringsListScope] = useState<
    'screen' | 'application'
  >('screen')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const stringsTabDescriptors = useMemo(() => {
    const raw =
      stringsListScope === 'application'
        ? allApplicationMessageDescriptors
        : screenMessageDescriptors
    const seen = new Set<string>()
    return raw.filter((d) => {
      if (seen.has(d.id)) return false
      seen.add(d.id)
      return true
    })
  }, [
    stringsListScope,
    allApplicationMessageDescriptors,
    screenMessageDescriptors,
  ])
  const setActiveTab = (tab: string) => {
    setActiveTabRaw(tab)
    onActiveTabChange?.(tab)
  }

  const totalStringCount =
    stringsTabDescriptors.length +
    (showValidationErrors ? validationDescriptors.length : 0)

  const tabs = [
    {
      id: STATES_TAB_ID,
      label: formatMessage(m.translationStatesTab),
    },
    {
      id: STRINGS_TAB_ID,
      label: withCount(
        formatMessage(m.translationStringsTab),
        totalStringCount,
      ),
    },
  ]

  const handleTabKeyDown = (index: number, event: KeyboardEvent) => {
    const last = tabs.length - 1
    let next: number | undefined
    if (event.key === 'ArrowRight') {
      next = index === last ? 0 : index + 1
    } else if (event.key === 'ArrowLeft') {
      next = index === 0 ? last : index - 1
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = last
    }
    if (next === undefined) {
      return
    }
    event.preventDefault()
    setActiveTab(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <Box
      role="navigation"
      background="white"
      aria-label={formatMessage(m.translationStatesNavDrawerAriaLabel)}
      className={styles.tabsPanelRoot}
    >
      <Box
        role="tablist"
        aria-label={formatMessage(m.translationWorkspaceTabsAriaLabel)}
        background="blue100"
        borderColor="blue100"
        borderWidth="large"
        flexShrink={0}
        className={styles.tabList}
      >
        {tabs.map((tab, index) => {
          const isSelected = tab.id === activeTab
          const selectedIndex = tabs.findIndex((t) => t.id === activeTab)
          const isPreviousToSelectedTab = index + 1 === selectedIndex
          const isNextToSelectedTab = index - 1 === selectedIndex
          return (
            <Box
              key={tab.id}
              component="button"
              type="button"
              role="tab"
              id={`translation-workspace-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`translation-workspace-tabpanel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={cn(styles.tab, {
                [styles.tabSelected]: isSelected,
                [styles.tabNotSelected]:
                  !isSelected &&
                  !isPreviousToSelectedTab &&
                  !isNextToSelectedTab,
                [styles.tabPreviousToSelectedTab]: isPreviousToSelectedTab,
                [styles.tabNextToSelectedTab]: isNextToSelectedTab,
              })}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(index, event)}
              ref={(node) => {
                tabRefs.current[index] = node as HTMLButtonElement | null
              }}
            >
              <div className={styles.circleElement} />
              <span className={styles.squareElement} />
              <Text
                as="span"
                variant="small"
                fontWeight={isSelected ? 'semiBold' : 'light'}
                color={isSelected ? 'blue400' : 'dark400'}
                truncate
                className={styles.tabText}
              >
                {tab.label}
              </Text>
            </Box>
          )
        })}
      </Box>

      <Box
        role="tabpanel"
        id={`translation-workspace-tabpanel-${activeTab}`}
        aria-labelledby={`translation-workspace-tab-${activeTab}`}
        className={styles.tabPanel}
      >
        {activeTab === STATES_TAB_ID && (
          <Box className={styles.tabsPanelScroll}>
            <Box className={styles.tabsPanelInner}>
              <TranslationWorkspaceStatesNav
                states={states}
                selectedLocation={selectedLocation}
                onNavClick={onNavClick}
                persistedByKey={persistedByKey}
                editedValues={editedValues}
                ownedNamespaces={ownedNamespaces}
                formatMessage={formatMessage}
              />
            </Box>
          </Box>
        )}
        {activeTab === STRINGS_TAB_ID && (
          <TabsPanelStringsTab
            selectedScreen={selectedScreen}
            visibleDescriptors={stringsTabDescriptors}
            stringsListScope={stringsListScope}
            onStringsListScopeChange={setStringsListScope}
            applicationStringCount={allApplicationMessageDescriptors.length}
            editedValues={editedValues}
            activeLocale={activeLocale}
            onLocaleChange={onLocaleChange}
            getPersistedValue={getPersistedValue}
            onValueChange={onValueChange}
            showValidationErrors={showValidationErrors}
            validationDescriptors={validationDescriptors}
            formatMessage={formatMessage}
            persistedByKey={persistedByKey}
            onGoogleTranslate={onGoogleTranslate}
            onGoogleTranslateAll={onGoogleTranslateAll}
            translatingIds={translatingIds}
          />
        )}
      </Box>
    </Box>
  )
}
