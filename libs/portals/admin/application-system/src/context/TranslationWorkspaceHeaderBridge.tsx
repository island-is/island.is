import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  isReady,
}: TranslationWorkspaceHeaderChrome & { isReady: boolean }) => {
  const { setWorkspaceChrome } = useTranslationWorkspaceHeaderBridge()

  useEffect(() => {
    if (!isReady) {
      setWorkspaceChrome(null)
      return undefined
    }
    setWorkspaceChrome({
      activeLocale,
      onLocaleChange,
      hasUnsavedChanges,
      unsavedCount,
      saving,
      onSaveAll,
      formatMessage,
    })
    return () => {
      setWorkspaceChrome(null)
    }
  }, [
    isReady,
    activeLocale,
    onLocaleChange,
    hasUnsavedChanges,
    unsavedCount,
    saving,
    onSaveAll,
    formatMessage,
    setWorkspaceChrome,
  ])
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
