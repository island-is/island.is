import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from 'react'

import type { FormatMessage } from '@island.is/localization'
import { useNavigate } from 'react-router-dom'
import { Button, DropdownMenu, Icon, Text } from '@island.is/island-ui/core'

import { m } from '../lib/messages'
import { ApplicationSystemPaths } from '../lib/paths'
import * as styles from './TranslationWorkspaceHeader.css'

const useViewportMaxWidth = (maxWidthPx: number, initialMatches = false) => {
  const [matches, setMatches] = useState(initialMatches)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(`(max-width: ${maxWidthPx}px)`)
    const update = () => {
      setMatches(mediaQueryList.matches)
    }
    update()
    mediaQueryList.addEventListener('change', update)
    return () => mediaQueryList.removeEventListener('change', update)
  }, [maxWidthPx])

  return matches
}

export type TranslationWorkspacePreviewLocale = 'is' | 'en'

export type TranslationWorkspaceHeaderChrome = {
  activeLocale: TranslationWorkspacePreviewLocale
  onLocaleChange: (locale: TranslationWorkspacePreviewLocale) => void
  hasUnsavedChanges: boolean
  unsavedCount: number
  saving: boolean
  onSaveAll: () => void | Promise<boolean>
  formatMessage: FormatMessage
  showValidationErrors: boolean
  onToggleValidationErrors: () => void
  showValidationToggle?: boolean
  hasDraftChanges: boolean
  publishing: boolean
  onPublish: () => void
  onOpenHistory: () => void
  lastAutosaveTime: string | null
}

type TranslationWorkspaceHeaderBridgeContextValue = {
  workspaceChrome: TranslationWorkspaceHeaderChrome | null
  setWorkspaceChrome: Dispatch<
    SetStateAction<TranslationWorkspaceHeaderChrome | null>
  >
}

const TranslationWorkspaceHeaderBridgeContext = createContext<
  TranslationWorkspaceHeaderBridgeContextValue | undefined
>(undefined)

export const TranslationWorkspaceHeaderBridgeProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [workspaceChrome, setWorkspaceChrome] =
    useState<TranslationWorkspaceHeaderChrome | null>(null)

  const value = useMemo(
    () => ({ workspaceChrome, setWorkspaceChrome }),
    [workspaceChrome],
  )

  return (
    <TranslationWorkspaceHeaderBridgeContext.Provider value={value}>
      {children}
    </TranslationWorkspaceHeaderBridgeContext.Provider>
  )
}

export const useTranslationWorkspaceHeaderBridge =
  (): TranslationWorkspaceHeaderBridgeContextValue => {
    const ctx = useContext(TranslationWorkspaceHeaderBridgeContext)
    if (!ctx) {
      throw new Error(
        'useTranslationWorkspaceHeaderBridge must be used within TranslationWorkspaceHeaderBridgeProvider',
      )
    }
    return ctx
  }

export const useTranslationWorkspaceHeaderBridgeOptional = ():
  | TranslationWorkspaceHeaderBridgeContextValue
  | undefined => useContext(TranslationWorkspaceHeaderBridgeContext)

/**
 * Registers translation workspace chrome (language tabs + save + publish) in the shell header.
 * When `isReady` is false, the shell clears (loading / error / locked route).
 */
export const useRegisterTranslationWorkspaceHeaderChrome = ({
  activeLocale,
  onLocaleChange,
  hasUnsavedChanges,
  unsavedCount,
  saving,
  onSaveAll,
  formatMessage,
  showValidationErrors,
  onToggleValidationErrors,
  showValidationToggle = true,
  hasDraftChanges,
  publishing,
  onPublish,
  onOpenHistory,
  lastAutosaveTime,
  isReady,
}: TranslationWorkspaceHeaderChrome & { isReady: boolean }) => {
  const { setWorkspaceChrome } = useTranslationWorkspaceHeaderBridge()

  const onLocaleChangeRef = useRef(onLocaleChange)
  const onSaveAllRef = useRef(onSaveAll)
  const onToggleValidationErrorsRef = useRef(onToggleValidationErrors)
  const formatMessageRef = useRef(formatMessage)
  const onPublishRef = useRef(onPublish)
  const onOpenHistoryRef = useRef(onOpenHistory)

  useEffect(() => {
    onLocaleChangeRef.current = onLocaleChange
  }, [onLocaleChange])

  useEffect(() => {
    onSaveAllRef.current = onSaveAll
  }, [onSaveAll])

  useEffect(() => {
    onToggleValidationErrorsRef.current = onToggleValidationErrors
  }, [onToggleValidationErrors])

  useEffect(() => {
    formatMessageRef.current = formatMessage
  }, [formatMessage])

  useEffect(() => {
    onPublishRef.current = onPublish
  }, [onPublish])

  useEffect(() => {
    onOpenHistoryRef.current = onOpenHistory
  }, [onOpenHistory])

  const stableOnLocaleChange = useCallback(
    (locale: TranslationWorkspacePreviewLocale) =>
      onLocaleChangeRef.current(locale),
    [],
  )

  const stableOnSaveAll = useCallback(() => onSaveAllRef.current(), [])

  const stableOnToggleValidationErrors = useCallback(
    () => onToggleValidationErrorsRef.current(),
    [],
  )

  const stableFormatMessage = useCallback<FormatMessage>(
    ((descriptor: any, values?: any) =>
      formatMessageRef.current(descriptor, values)) as FormatMessage,
    [],
  )

  const stableOnPublish = useCallback(() => onPublishRef.current(), [])

  const stableOnOpenHistory = useCallback(() => onOpenHistoryRef.current(), [])

  const chrome = useMemo<TranslationWorkspaceHeaderChrome>(
    () => ({
      activeLocale,
      onLocaleChange: stableOnLocaleChange,
      hasUnsavedChanges,
      unsavedCount,
      saving,
      onSaveAll: stableOnSaveAll,
      formatMessage: stableFormatMessage,
      showValidationErrors,
      onToggleValidationErrors: stableOnToggleValidationErrors,
      showValidationToggle,
      hasDraftChanges,
      publishing,
      onPublish: stableOnPublish,
      onOpenHistory: stableOnOpenHistory,
      lastAutosaveTime,
    }),
    [
      activeLocale,
      stableOnLocaleChange,
      hasUnsavedChanges,
      unsavedCount,
      saving,
      stableOnSaveAll,
      stableFormatMessage,
      showValidationErrors,
      stableOnToggleValidationErrors,
      showValidationToggle,
      hasDraftChanges,
      publishing,
      stableOnPublish,
      stableOnOpenHistory,
      lastAutosaveTime,
    ],
  )

  useEffect(() => {
    return () => {
      setWorkspaceChrome(null)
    }
  }, [setWorkspaceChrome])

  useEffect(() => {
    if (!isReady) {
      setWorkspaceChrome(null)
      return undefined
    }
    setWorkspaceChrome(chrome)
    return undefined
  }, [isReady, chrome, setWorkspaceChrome])
}

export const TranslationWorkspaceHeaderBackButton = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome
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

  const label = chrome.formatMessage(m.translationBackToList)

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
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome?.lastAutosaveTime) {
    return null
  }

  return (
    <div className={styles.autosave} role="status">
      <span className={styles.srOnly}>
        {chrome.formatMessage(m.translationAutosaved, {
          time: chrome.lastAutosaveTime,
        })}
      </span>
      <Icon icon="checkmark" size="small" color="blue400" ariaHidden />
      <Text variant="small" color="dark300" as="span">
        <span className={styles.autosaveLabel} aria-hidden="true">
          {chrome.formatMessage(m.translationAutosaveLabel)}{' '}
        </span>
        <span className={styles.autosaveTime} aria-hidden="true">
          {chrome.lastAutosaveTime}
        </span>
      </Text>
    </div>
  )
}

export const TranslationWorkspaceHeaderLocaleButton = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome) {
    return null
  }

  const nextLocale: TranslationWorkspacePreviewLocale =
    chrome.activeLocale === 'is' ? 'en' : 'is'
  const label =
    nextLocale === 'en'
      ? chrome.formatMessage(m.translationLocaleEnglish)
      : chrome.formatMessage(m.translationLocaleIcelandic)
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
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome) {
    return null
  }

  const label = chrome.formatMessage(m.translationPublishHistory)

  return (
    <span className={styles.history}>
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
  )
}

export const TranslationWorkspaceHeaderSaveButton = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

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
        {chrome.formatMessage(m.translationSaveDraft)} ({chrome.unsavedCount})
      </Button>
    </span>
  )
}

export const TranslationWorkspaceHeaderPublishButton = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

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
        {chrome.formatMessage(m.translationPublish)}
      </Button>
    </span>
  )
}

export const TranslationWorkspaceHeaderValidationToggle = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome || chrome.showValidationToggle === false) {
    return null
  }

  return (
    <Button
      size="small"
      variant={chrome.showValidationErrors ? 'primary' : 'ghost'}
      onClick={chrome.onToggleValidationErrors}
    >
      {chrome.formatMessage(m.translationValidationErrors)}
    </Button>
  )
}

export const TranslationWorkspaceHeaderOverflowMenu = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome
  const localeInOverflow = useViewportMaxWidth(styles.overflowMenuMaxPx, true)
  const saveInOverflow = useViewportMaxWidth(styles.compactActionsMaxPx, true)
  const historyInOverflow = useViewportMaxWidth(styles.historyCompactMaxPx, true)

  if (!chrome) {
    return null
  }

  const nextLocale: TranslationWorkspacePreviewLocale =
    chrome.activeLocale === 'is' ? 'en' : 'is'
  const localeTitle =
    nextLocale === 'en'
      ? chrome.formatMessage(m.translationLocaleEnglish)
      : chrome.formatMessage(m.translationLocaleIcelandic)
  const historyTitle = chrome.formatMessage(m.translationPublishHistory)
  const moreActions = chrome.formatMessage(m.translationMoreActions)
  const saveTitle = chrome.hasUnsavedChanges
    ? `${chrome.formatMessage(m.translationSaveDraft)} (${chrome.unsavedCount})`
    : null
  const publishTitle =
    chrome.hasDraftChanges || chrome.hasUnsavedChanges
      ? chrome.formatMessage(m.translationPublish)
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
