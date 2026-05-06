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
import { Box, Button, Tabs } from '@island.is/island-ui/core'

import { m } from '../lib/messages'

export type TranslationWorkspacePreviewLocale = 'is' | 'en'

export type TranslationWorkspaceHeaderChrome = {
  activeLocale: TranslationWorkspacePreviewLocale
  onLocaleChange: (locale: TranslationWorkspacePreviewLocale) => void
  hasUnsavedChanges: boolean
  unsavedCount: number
  saving: boolean
  onSaveAll: () => void
  formatMessage: FormatMessage
  showValidationErrors: boolean
  onToggleValidationErrors: () => void
}

type TranslationWorkspaceHeaderBridgeContextValue = {
  workspaceChrome: TranslationWorkspaceHeaderChrome | null
  setWorkspaceChrome: Dispatch<
    SetStateAction<TranslationWorkspaceHeaderChrome | null>
  >
}

const TranslationWorkspaceHeaderBridgeContext =
  createContext<TranslationWorkspaceHeaderBridgeContextValue | undefined>(
    undefined,
  )

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

export const useTranslationWorkspaceHeaderBridgeOptional =
  (): TranslationWorkspaceHeaderBridgeContextValue | undefined =>
    useContext(TranslationWorkspaceHeaderBridgeContext)

/**
 * Registers translation workspace chrome (language tabs + save) in the shell header.
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
  isReady,
}: TranslationWorkspaceHeaderChrome & { isReady: boolean }) => {
  const { setWorkspaceChrome } = useTranslationWorkspaceHeaderBridge()

  // These callbacks are often created inline in the page component and therefore
  // change identity on every render. Storing them in refs prevents an effect loop
  // where updating the header causes a rerender, which recreates callbacks, which
  // triggers the header registration effect again.
  const onLocaleChangeRef = useRef(onLocaleChange)
  const onSaveAllRef = useRef(onSaveAll)
  const onToggleValidationErrorsRef = useRef(onToggleValidationErrors)
  const formatMessageRef = useRef(formatMessage)

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

  const stableFormatMessage: FormatMessage = useCallback(
    (...args) => formatMessageRef.current(...args),
    [],
  )

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
    ],
  )

  // Clear chrome on unmount (route change).
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

  if (!chrome?.hasUnsavedChanges) {
    return null
  }

  return (
    <Button size="small" loading={chrome.saving} onClick={chrome.onSaveAll}>
      {chrome.formatMessage(m.translationSaveAll)} ({chrome.unsavedCount})
    </Button>
  )
}

export const TranslationWorkspaceHeaderValidationToggle = () => {
  const ctx = useTranslationWorkspaceHeaderBridgeOptional()
  const chrome = ctx?.workspaceChrome

  if (!chrome) {
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
