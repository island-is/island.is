import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import cn from 'classnames'
import { Box, Text } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  MessageDescriptor,
  ResolvePreviewString,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import { TranslationWorkspaceStatesNav } from '../TranslationWorkspaceStatesNav/TranslationWorkspaceStatesNav'
import {
  FIELDS_TAB_ID,
  STATES_TAB_ID,
  STRINGS_TAB_ID,
  flattenFocusableFields,
} from '../../utils/translationWorkspaceNavPanel'
import { TabsPanelStringsTab } from './TabsPanelStringsTab'
import { TabsPanelFieldsTab } from './TabsPanelFieldsTab'
import * as styles from './TranslationWorkspaceStatesTabsPanel.css'

export interface TranslationWorkspaceStatesTabsPanelProps {
  states: TemplateStateNav[]
  selectedScreenId: string | undefined
  selectedLocation: SidebarNavLocation | null
  onNavClick: (nav: ScreenIntrospection, location: SidebarNavLocation) => void
  formatMessage: FormatMessage
  selectedScreen: ScreenIntrospection | null
  screenMessageDescriptors: MessageDescriptor[]
  allApplicationMessageDescriptors: MessageDescriptor[]
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  getPersistedForLocale: (messageKey: string) => string
  onValueChange: (messageKey: string, value: string) => void
  showValidationErrors: boolean
  validationDescriptors: ValidationMessageDescriptor[]
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>
  previewScreens: ScreenIntrospection[]
  resolvePreviewString: ResolvePreviewString
  validationDescriptorsByPath: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId: string | null
  onFocusedFieldChange: (fieldId: string | null) => void
  fieldErrorOverrides: Set<string>
  onToggleFieldError: (fieldId: string) => void
  onSetPreviewFieldValue: (fieldId: string, value: string) => void
  onActiveTabChange?: (tab: string) => void
  onGoogleTranslate?: (descriptorId: string, sourceText: string) => void
  onGoogleTranslateAll?: (
    items: Array<{ id: string; sourceText: string }>,
  ) => void
  translatingIds?: ReadonlySet<string>
}

const withCount = (label: string, count: number) =>
  count > 0 ? `${label} (${count})` : label

export const TranslationWorkspaceStatesTabsPanel = ({
  states,
  selectedScreenId,
  selectedLocation,
  onNavClick,
  formatMessage,
  selectedScreen,
  screenMessageDescriptors,
  allApplicationMessageDescriptors,
  editedValues,
  activeLocale,
  getPersistedForLocale,
  onValueChange,
  showValidationErrors,
  validationDescriptors,
  persistedByKey,
  previewScreens,
  validationDescriptorsByPath,
  focusedFieldId,
  onFocusedFieldChange,
  fieldErrorOverrides,
  onToggleFieldError,
  onSetPreviewFieldValue,
  onActiveTabChange,
  onGoogleTranslate,
  onGoogleTranslateAll,
  translatingIds,
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

  const focusableFields = useMemo(
    () => flattenFocusableFields(previewScreens),
    [previewScreens],
  )

  const focusedIndex = useMemo(() => {
    if (!focusedFieldId) return 0
    const idx = focusableFields.findIndex((f) => f.id === focusedFieldId)
    return idx >= 0 ? idx : 0
  }, [focusedFieldId, focusableFields])

  useEffect(() => {
    if (
      focusableFields.length > 0 &&
      (!focusedFieldId || !focusableFields.some((f) => f.id === focusedFieldId))
    ) {
      onFocusedFieldChange(focusableFields[0].id)
    }
  }, [focusableFields, focusedFieldId, onFocusedFieldChange])

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
    {
      id: FIELDS_TAB_ID,
      label: withCount(
        formatMessage(m.translationFieldsTab),
        focusableFields.length,
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
        borderRadius="standard"
        borderColor="blue100"
        borderWidth="large"
        flexShrink={0}
        className={styles.tabList}
      >
        {tabs.map((tab, index) => {
          const isSelected = tab.id === activeTab
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
              className={cn(styles.tab, isSelected && styles.tabSelected)}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(index, event)}
              ref={(node) => {
                tabRefs.current[index] = node as HTMLButtonElement | null
              }}
            >
              <Text
                variant="small"
                fontWeight={isSelected ? 'semiBold' : 'light'}
                color={isSelected ? 'blue400' : 'black'}
                truncate
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
        <Box
          className={cn(
            styles.tabsPanelScroll,
            activeTab !== STATES_TAB_ID && styles.tabPanelHidden,
          )}
          hidden={activeTab !== STATES_TAB_ID}
        >
          <Box className={styles.tabsPanelInner}>
            <TranslationWorkspaceStatesNav
              states={states}
              selectedScreenId={selectedScreenId}
              selectedLocation={selectedLocation}
              onNavClick={onNavClick}
              persistedByKey={persistedByKey}
              editedValues={editedValues}
              activeLocale={activeLocale}
            />
          </Box>
        </Box>
        {activeTab === STRINGS_TAB_ID && (
          <TabsPanelStringsTab
            selectedScreen={selectedScreen}
            visibleDescriptors={stringsTabDescriptors}
            stringsListScope={stringsListScope}
            onStringsListScopeChange={setStringsListScope}
            applicationStringCount={allApplicationMessageDescriptors.length}
            editedValues={editedValues}
            activeLocale={activeLocale}
            getPersistedForLocale={getPersistedForLocale}
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
        {activeTab === FIELDS_TAB_ID && (
          <TabsPanelFieldsTab
            focusableFields={focusableFields}
            focusedIndex={focusedIndex}
            editedValues={editedValues}
            activeLocale={activeLocale}
            getPersistedForLocale={getPersistedForLocale}
            onValueChange={onValueChange}
            validationDescriptorsByPath={validationDescriptorsByPath}
            fieldErrorOverrides={fieldErrorOverrides}
            onToggleFieldError={onToggleFieldError}
            onSetPreviewFieldValue={onSetPreviewFieldValue}
            onFocusedFieldChange={onFocusedFieldChange}
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
