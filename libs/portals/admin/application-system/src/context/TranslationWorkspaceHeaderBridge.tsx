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
import { Box, Button, Inline, Tabs, Text } from '@island.is/island-ui/core'

import { m } from '../lib/messages'
import { ApplicationSystemPaths } from '../lib/paths'

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

  return (
    <Button
      variant="text"
      size="small"
      loading={navigating || chrome.saving}
      onClick={handleBack}
    >
      {chrome.formatMessage(m.translationBackToList)}
    </Button>
  )
}

export const TranslationWorkspaceHeaderLanguageTabs = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()

  if (!ctx?.workspaceChrome) {
    return null
  }

  const { activeLocale, onLocaleChange } = ctx.workspaceChrome

  return (
    <Tabs
      label="Language"
      contentBackground="white"
      selected={activeLocale}
      tabs={[
        { id: 'is', label: 'IS', content: <Box /> },
        { id: 'en', label: 'EN', content: <Box /> },
      ]}
      onChange={(id: string) =>
        onLocaleChange(id as TranslationWorkspacePreviewLocale)
      }
    />
  )
}

export const TranslationWorkspaceHeaderSaveButton = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome) {
    return null
  }

  return (
    <Inline space={2} alignY="center">
      {chrome.lastAutosaveTime && (
        <Text variant="small" color="dark300">
          {chrome.formatMessage(m.translationAutosaved, {
            time: chrome.lastAutosaveTime,
          })}
        </Text>
      )}
      {chrome.hasUnsavedChanges && (
        <Button
          size="small"
          variant="ghost"
          loading={chrome.saving}
          onClick={chrome.onSaveAll}
        >
          {chrome.formatMessage(m.translationSaveDraft)} ({chrome.unsavedCount})
        </Button>
      )}
    </Inline>
  )
}

export const TranslationWorkspaceHeaderPublishButton = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome) {
    return null
  }

  return (
    <Inline space={2} alignY="center">
      <Button size="small" variant="ghost" onClick={chrome.onOpenHistory}>
        {chrome.formatMessage(m.translationPublishHistory)}
      </Button>
      {(chrome.hasDraftChanges || chrome.hasUnsavedChanges) && (
        <Button
          size="small"
          loading={chrome.publishing}
          onClick={chrome.onPublish}
        >
          {chrome.formatMessage(m.translationPublish)}
        </Button>
      )}
    </Inline>
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

/** Shell header actions (md+). Renders nothing when workspace chrome is not registered. */
export const TranslationWorkspaceHeaderActions = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()

  if (!ctx?.workspaceChrome) {
    return null
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      columnGap={2}
      marginRight={[1, 1, 2]}
    >
      <TranslationWorkspaceHeaderBackButton />
      <TranslationWorkspaceHeaderSaveButton />
      <TranslationWorkspaceHeaderPublishButton />
      <TranslationWorkspaceHeaderLanguageTabs />
    </Box>
  )
}
