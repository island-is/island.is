import {
  coreDefaultFieldMessages,
  coreErrorMessages,
  coreMessages,
} from '@island.is/application/core'
import type {
  MessageDescriptor,
  ResolvePreviewString,
  ScreenIntrospection,
} from '../types/translationWorkspace'

const isDescriptorLike = (
  v: unknown,
): v is Pick<MessageDescriptor, 'id' | 'defaultMessage'> =>
  typeof v === 'object' &&
  v !== null &&
  'id' in v &&
  typeof (v as { id?: unknown }).id === 'string'

const collectDescriptorsFromDefineMessagesModule = (
  mod: Record<string, unknown>,
): Array<{ id: string; defaultMessage?: string | null }> => {
  const out: Array<{ id: string; defaultMessage?: string | null }> = []
  for (const v of Object.values(mod)) {
    if (isDescriptorLike(v)) {
      const dm = v.defaultMessage
      out.push({
        id: v.id,
        defaultMessage:
          dm == null
            ? undefined
            : typeof dm === 'string'
              ? dm
              : String(dm),
      })
    }
  }
  return out
}

/**
 * DFS walk of introspection subtrees (`MULTI_FIELD` children, repeaters…).
 */
export const collectTranslationWorkspaceScreenDescriptors = (
  screens: ScreenIntrospection[],
): MessageDescriptor[] => {
  const seen = new Set<string>()
  const out: MessageDescriptor[] = []

  const visit = (s: ScreenIntrospection) => {
    for (const d of s.messageDescriptors ?? []) {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        out.push(d)
      }
    }
    if (Array.isArray(s.children)) {
      for (const c of s.children) {
        visit(c)
      }
    }
  }

  for (const s of screens) {
    visit(s)
  }
  return out
}

/**
 * Builds a flat dictionary for `<IntlProvider messages={…}>` so `useIntl().formatMessage`
 * matches Translation Workspace drafts/persistence via `resolvePreviewString`.
 */
export const buildTranslationWorkspacePreviewIntlMessages = (
  previewScreens: ScreenIntrospection[],
  resolvePreviewString: ResolvePreviewString,
): Record<string, string> => {
  const messages: Record<string, string> = {}

  const add = (id: string, defaultMessage?: string | null) => {
    if (!id || id in messages) return
    messages[id] = resolvePreviewString(id, defaultMessage ?? '')
  }

  for (const d of collectDescriptorsFromDefineMessagesModule(
    coreMessages as unknown as Record<string, unknown>,
  )) {
    add(d.id, d.defaultMessage)
  }
  for (const d of collectDescriptorsFromDefineMessagesModule(
    coreErrorMessages as unknown as Record<string, unknown>,
  )) {
    add(d.id, d.defaultMessage)
  }
  for (const d of collectDescriptorsFromDefineMessagesModule(
    coreDefaultFieldMessages as unknown as Record<string, unknown>,
  )) {
    add(d.id, d.defaultMessage)
  }

  for (const d of collectTranslationWorkspaceScreenDescriptors(previewScreens)) {
    add(d.id, d.defaultMessage)
  }

  return messages
}
