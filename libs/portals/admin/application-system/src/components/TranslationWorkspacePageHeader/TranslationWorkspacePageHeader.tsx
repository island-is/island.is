import {
  Box,
  Text,
  Button,
  Breadcrumbs,
  Tabs,
  Tag,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import { ApplicationSystemPaths } from '../../lib/paths'
import { m } from '../../lib/messages'

export interface TranslationWorkspacePageHeaderProps {
  templateName: string
  templateSlug: string
  formatMessage: FormatMessage
  onNavigateToTranslations: () => void
  activeLocale: 'is' | 'en'
  onLocaleChange: (locale: 'is' | 'en') => void
  hasUnsavedChanges: boolean
  unsavedCount: number
  saving: boolean
  onSaveAll: () => void
  selectedScreen: boolean
  stringsDrawerOpen: boolean
  onOpenStringsDrawer: () => void
  currentDescriptorCount: number
}

export const TranslationWorkspacePageHeader = ({
  templateName,
  templateSlug,
  formatMessage,
  onNavigateToTranslations,
  activeLocale,
  onLocaleChange,
  hasUnsavedChanges,
  unsavedCount,
  saving,
  onSaveAll,
  selectedScreen,
  stringsDrawerOpen,
  onOpenStringsDrawer,
  currentDescriptorCount,
}: TranslationWorkspacePageHeaderProps) => (
  <>
    <Breadcrumbs
      items={[
        { title: 'Ísland.is', href: '/stjornbord' },
        {
          title: formatMessage(m.applicationSystem),
          href: `/stjornbord${ApplicationSystemPaths.Root}`,
        },
        {
          title: formatMessage(m.translations),
          href: `/stjornbord${ApplicationSystemPaths.Translations}`,
        },
        { title: templateName },
      ]}
    />

    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      marginTop={3}
      marginBottom={3}
    >
      <Box display="flex" alignItems="center" columnGap={2}>
        <Button
          variant="ghost"
          size="small"
          onClick={onNavigateToTranslations}
        >
          {formatMessage(m.translationBackToList)}
        </Button>
        <Text variant="h3">{templateName}</Text>
        <Tag variant="blue">{templateSlug}</Tag>
      </Box>

      <Box display="flex" columnGap={2}>
        <Tabs
          label="Language"
          contentBackground="white"
          selected={activeLocale}
          tabs={[
            { id: 'is', label: 'IS', content: <Box /> },
            { id: 'en', label: 'EN', content: <Box /> },
          ]}
          onChange={(id: string) => onLocaleChange(id as 'is' | 'en')}
        />
        {hasUnsavedChanges && (
          <Button size="small" loading={saving} onClick={onSaveAll}>
            {formatMessage(m.translationSaveAll)} ({unsavedCount})
          </Button>
        )}
        {selectedScreen && !stringsDrawerOpen && (
          <Button size="small" variant="ghost" onClick={onOpenStringsDrawer}>
            {formatMessage(m.translationStringsOpenButton, {
              count: currentDescriptorCount,
            })}
          </Button>
        )}
      </Box>
    </Box>
  </>
)
