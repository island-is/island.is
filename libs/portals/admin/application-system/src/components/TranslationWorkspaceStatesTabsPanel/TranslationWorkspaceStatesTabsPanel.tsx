import { useEffect, useMemo, useState } from 'react'
import { Box, Tabs } from '@island.is/island-ui/core'
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
  currentDescriptors: MessageDescriptor[]
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
}

export const TranslationWorkspaceStatesTabsPanel = ({
  states,
  selectedScreenId,
  selectedLocation,
  onNavClick,
  formatMessage,
  selectedScreen,
  currentDescriptors,
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
}: TranslationWorkspaceStatesTabsPanelProps) => {
  const [activeTab, setActiveTabRaw] = useState('states')
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

  useEffect(() => {
    if (selectedScreen) {
      setActiveTab(STRINGS_TAB_ID)
    }
  }, [selectedScreen?.id])

  const statesContent = (
    <Box className={styles.tabsPanelScroll}>
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
  )

  const totalStringCount =
    currentDescriptors.length +
    (showValidationErrors ? validationDescriptors.length : 0)

  const tabs = [
    { id: 'states', label: 'States', content: statesContent },
    {
      id: STRINGS_TAB_ID,
      label: `Strings${totalStringCount ? ` (${totalStringCount})` : ''}`,
      content: (
        <TabsPanelStringsTab
          selectedScreen={selectedScreen}
          currentDescriptors={currentDescriptors}
          editedValues={editedValues}
          activeLocale={activeLocale}
          getPersistedForLocale={getPersistedForLocale}
          onValueChange={onValueChange}
          showValidationErrors={showValidationErrors}
          validationDescriptors={validationDescriptors}
          formatMessage={formatMessage}
        />
      ),
    },
    {
      id: FIELDS_TAB_ID,
      label: `${formatMessage(m.translationFieldsTab)}${
        focusableFields.length ? ` (${focusableFields.length})` : ''
      }`,
      content: (
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
        />
      ),
    },
  ]

  return (
    <Box
      role="navigation"
      background="white"
      aria-label={formatMessage(m.translationStatesNavDrawerAriaLabel)}
      className={styles.tabsPanelRoot}
    >
      <Tabs
        label="Translation workspace panel"
        tabs={tabs}
        selected={activeTab}
        onChange={setActiveTab}
        contentBackground="white"
        variant="alternative"
        size="md"
      />
    </Box>
  )
}
