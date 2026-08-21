import { useEffect, useMemo, type ReactNode } from 'react'
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
} from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import type { Locale } from '@island.is/shared/types'
import { LocaleContext } from '@island.is/localization'
import { noop } from '../../utils/translationWorkspaceFieldConstants'
import type {
  ResolvePreviewString,
  ScreenIntrospection,
} from '../../types/translationWorkspace'
import { buildTranslationWorkspacePreviewIntlMessages } from '../../utils/translationWorkspacePreviewIntlMessages'

const collectScreenFieldIdsDeep = (
  screens: ScreenIntrospection[],
): string[] => {
  const ids: string[] = []
  const seen = new Set<string>()

  const visit = (s: ScreenIntrospection) => {
    if (s.id && !seen.has(s.id)) {
      seen.add(s.id)
      ids.push(s.id)
    }
    if (Array.isArray(s.children)) {
      for (const c of s.children) visit(c)
    }
  }

  for (const s of screens) {
    visit(s)
  }
  return ids
}

const buildTranslationWorkspacePreviewDefaultValues = (
  previewScreens: ScreenIntrospection[],
  previewFieldValues: Record<string, string>,
): Record<string, unknown> => {
  const values: Record<string, unknown> = {}
  const ids = collectScreenFieldIdsDeep(previewScreens)
  for (const id of ids) {
    values[id] = previewFieldValues[id] ?? ''
  }
  return values
}

interface TranslationWorkspacePreviewShellProps {
  activeLocale: 'is' | 'en'
  previewScreens: ScreenIntrospection[]
  previewFieldValues: Record<string, string>
  resolvePreviewString: ResolvePreviewString
  children: ReactNode
}

/**
 * Binds `@island.is/application/ui-fields` hooks to Translation Workspace locale and copy:
 * overrides `IntlProvider` + `LocaleContext` for preview subtree only (no Apollo `LocaleProvider`).
 */
export const TranslationWorkspacePreviewShell = ({
  activeLocale,
  previewScreens,
  previewFieldValues,
  resolvePreviewString,
  children,
}: TranslationWorkspacePreviewShellProps) => {
  const messages = useMemo(
    () =>
      buildTranslationWorkspacePreviewIntlMessages(
        previewScreens,
        resolvePreviewString,
      ),
    [previewScreens, resolvePreviewString],
  )

  const defaultValues = useMemo(
    () =>
      buildTranslationWorkspacePreviewDefaultValues(
        previewScreens,
        previewFieldValues,
      ),
    [previewScreens, previewFieldValues],
  )

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues as DefaultValues<FieldValues>,
  })

  useEffect(() => {
    methods.reset(
      buildTranslationWorkspacePreviewDefaultValues(
        previewScreens,
        previewFieldValues,
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewScreens, previewFieldValues, activeLocale])

  const localeCtx = useMemo(
    () => ({
      lang: activeLocale as Locale,
      loadingMessages: false,
      loadedNamespaces: [] as string[],
      messages,
      loadMessages: noop as (namespaces: string | string[]) => void,
      changeLanguage: noop as (lang: Locale) => void,
    }),
    [activeLocale, messages],
  )

  return (
    <LocaleContext.Provider value={localeCtx}>
      <IntlProvider
        locale={activeLocale}
        messages={messages}
        defaultLocale="is"
      >
        <FormProvider {...methods}>{children}</FormProvider>
      </IntlProvider>
    </LocaleContext.Provider>
  )
}
