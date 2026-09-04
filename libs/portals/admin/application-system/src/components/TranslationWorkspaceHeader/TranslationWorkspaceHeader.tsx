import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DropdownMenu, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationSystemPaths } from '../../lib/paths'
import { useViewportMaxWidth } from '../../hooks/useViewportMaxWidth'
import { useTranslationWorkspaceHeaderBridgeOptional } from '../../context/TranslationWorkspaceHeaderBridge'
import type { TranslationWorkspacePreviewLocale } from '../../context/TranslationWorkspaceHeaderBridge'
import * as styles from './TranslationWorkspaceHeader.css'

const useHeaderChrome = () => {
  const chrome = useTranslationWorkspaceHeaderBridgeOptional()?.workspaceChrome
  const { formatMessage } = useLocale()
  return { chrome, formatMessage }
}

export const TranslationWorkspaceHeaderBackButton = () => {
  const { chrome, formatMessage } = useHeaderChrome()
  const navigate = useNavigate()
  const [navigating, setNavigating] = useState(false)

  const handleBack = useCallback(async () => {
    if (!chrome || navigating || chrome.saving) {
      return
    }

    setNavigating(true)
    try {
      if (chrome.hasUnsavedChanges) {
        const saved = await chrome.onSaveAll()
        if (saved === false) {
          return
        }
      }
      navigate(ApplicationSystemPaths.Root)
    } finally {
      setNavigating(false)
    }
  }, [chrome, navigate, navigating])

  if (!chrome) {
    return null
  }

  const label = formatMessage(m.translationBackToList)

  return (
    <div className={styles.back}>
      <span className={styles.backCompact}>
        <Button
          circle
          colorScheme="light"
          icon="chevronBack"
          loading={navigating || chrome.saving}
          onClick={handleBack}
          title={label}
          aria-label={label}
        />
      </span>
      <span className={styles.backWide}>
        <Button
          variant="text"
          size="small"
          preTextIcon="arrowBack"
          loading={navigating || chrome.saving}
          onClick={handleBack}
          title={label}
          aria-label={label}
        >
          {label}
        </Button>
      </span>
    </div>
  )
}

export const TranslationWorkspaceHeaderAutosave = () => {
  const { chrome, formatMessage } = useHeaderChrome()

  if (!chrome) {
    return null
  }

  if (chrome.autosaveFailed) {
    const failedLabel = formatMessage(m.translationAutosaveFailed)

    return (
      <div className={styles.autosave} role="status">
        <span className={styles.srOnly}>{failedLabel}</span>
        <Icon icon="warning" size="small" color="red400" ariaHidden />
        <Text variant="small" color="red600" as="span" aria-hidden="true">
          {failedLabel}
        </Text>
      </div>
    )
  }

  if (!chrome.lastAutosaveTime) {
    return null
  }

  return (
    <div className={styles.autosave} role="status">
      <span className={styles.srOnly}>
        {formatMessage(m.translationAutosaved, {
          time: chrome.lastAutosaveTime,
        })}
      </span>
      <Icon icon="checkmark" size="small" color="blue400" ariaHidden />
      <Text variant="small" color="dark300" as="span">
        <span className={styles.autosaveLabel} aria-hidden="true">
          {formatMessage(m.translationAutosaveLabel)}{' '}
        </span>
        <span className={styles.autosaveTime} aria-hidden="true">
          {chrome.lastAutosaveTime}
        </span>
      </Text>
    </div>
  )
}

export const TranslationWorkspaceHeaderLocaleButton = () => {
  const { chrome, formatMessage } = useHeaderChrome()

  if (!chrome) {
    return null
  }

  const nextLocale: TranslationWorkspacePreviewLocale =
    chrome.activeLocale === 'is' ? 'en' : 'is'
  const label =
    nextLocale === 'en'
      ? formatMessage(m.translationLocaleEnglish)
      : formatMessage(m.translationLocaleIcelandic)
  const shortLabel = nextLocale === 'en' ? 'EN' : 'IS'

  return (
    <span className={styles.locale}>
      <Button
        size="small"
        variant="ghost"
        onClick={() => chrome.onLocaleChange(nextLocale)}
        title={label}
        aria-label={label}
        lang={nextLocale}
      >
        {shortLabel}
      </Button>
    </span>
  )
}

export const TranslationWorkspaceHeaderHistoryButton = () => {
  const { chrome, formatMessage } = useHeaderChrome()

  if (!chrome) {
    return null
  }

  const label = formatMessage(m.translationPublishHistory)

  return (
    <span className={styles.history}>
      <span className={styles.historyCompact}>
        <Button
          size="small"
          variant="ghost"
          icon="time"
          iconType="outline"
          onClick={chrome.onOpenHistory}
          title={label}
          aria-label={label}
        />
      </span>
      <span className={styles.historyWide}>
        <Button
          size="small"
          variant="ghost"
          preTextIcon="time"
          preTextIconType="outline"
          nowrap
          onClick={chrome.onOpenHistory}
          title={label}
          aria-label={label}
        >
          {label}
        </Button>
      </span>
    </span>
  )
}

export const TranslationWorkspaceHeaderSaveButton = () => {
  const { chrome, formatMessage } = useHeaderChrome()

  if (!chrome?.hasUnsavedChanges) {
    return null
  }

  return (
    <span className={styles.save}>
      <Button
        size="small"
        variant="ghost"
        loading={chrome.saving}
        onClick={chrome.onSaveAll}
      >
        {formatMessage(m.translationSaveDraft)} ({chrome.unsavedCount})
      </Button>
    </span>
  )
}

export const TranslationWorkspaceHeaderPublishButton = () => {
  const { chrome, formatMessage } = useHeaderChrome()

  if (!chrome) {
    return null
  }

  if (!chrome.hasDraftChanges && !chrome.hasUnsavedChanges) {
    return null
  }

  return (
    <span className={styles.publish}>
      <Button
        size="small"
        loading={chrome.publishing}
        onClick={chrome.onPublish}
      >
        {formatMessage(m.translationPublish)}
      </Button>
    </span>
  )
}

export const TranslationWorkspaceHeaderValidationToggle = () => {
  const { chrome, formatMessage } = useHeaderChrome()

  if (!chrome || chrome.showValidationToggle === false) {
    return null
  }

  return (
    <Button
      size="small"
      variant={chrome.showValidationErrors ? 'primary' : 'ghost'}
      onClick={chrome.onToggleValidationErrors}
    >
      {formatMessage(m.translationValidationErrors)}
    </Button>
  )
}

export const TranslationWorkspaceHeaderOverflowMenu = () => {
  const { chrome, formatMessage } = useHeaderChrome()
  const localeInOverflow = useViewportMaxWidth(styles.overflowMenuMaxPx, true)
  const saveInOverflow = useViewportMaxWidth(styles.compactActionsMaxPx, true)
  const historyInOverflow = useViewportMaxWidth(
    styles.historyCompactMaxPx,
    true,
  )

  if (!chrome) {
    return null
  }

  const nextLocale: TranslationWorkspacePreviewLocale =
    chrome.activeLocale === 'is' ? 'en' : 'is'
  const localeTitle =
    nextLocale === 'en'
      ? formatMessage(m.translationLocaleEnglish)
      : formatMessage(m.translationLocaleIcelandic)
  const historyTitle = formatMessage(m.translationPublishHistory)
  const moreActions = formatMessage(m.translationMoreActions)
  const saveTitle = chrome.hasUnsavedChanges
    ? `${formatMessage(m.translationSaveDraft)} (${chrome.unsavedCount})`
    : null
  const publishTitle =
    chrome.hasDraftChanges || chrome.hasUnsavedChanges
      ? formatMessage(m.translationPublish)
      : null

  const items = [
    ...(saveTitle && saveInOverflow
      ? [
          {
            title: saveTitle,
            icon: 'save' as const,
            iconType: 'outline' as const,
            onClick: () => chrome.onSaveAll(),
          },
        ]
      : []),
    ...(publishTitle && saveInOverflow
      ? [
          {
            title: publishTitle,
            icon: 'upload' as const,
            iconType: 'outline' as const,
            onClick: () => chrome.onPublish(),
          },
        ]
      : []),
    ...(localeInOverflow
      ? [
          {
            title: localeTitle,
            icon: 'globe' as const,
            iconType: 'outline' as const,
            onClick: () => chrome.onLocaleChange(nextLocale),
          },
        ]
      : []),
    ...(historyInOverflow
      ? [
          {
            title: historyTitle,
            icon: 'time' as const,
            iconType: 'outline' as const,
            onClick: () => chrome.onOpenHistory(),
          },
        ]
      : []),
  ]

  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.overflow}>
      <DropdownMenu
        menuLabel={moreActions}
        disclosure={
          <Button
            size="small"
            variant="ghost"
            icon="ellipsisHorizontal"
            title={moreActions}
            aria-label={moreActions}
          />
        }
        items={items}
      />
    </div>
  )
}

/** Trail actions in the shell header. Renders nothing when workspace chrome is not registered. */
export const TranslationWorkspaceHeaderActions = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()

  if (!ctx?.workspaceChrome) {
    return null
  }

  return (
    <div className={styles.trailActions}>
      <TranslationWorkspaceHeaderLocaleButton />
      <TranslationWorkspaceHeaderHistoryButton />
      <TranslationWorkspaceHeaderSaveButton />
      <TranslationWorkspaceHeaderPublishButton />
      <TranslationWorkspaceHeaderOverflowMenu />
    </div>
  )
}
