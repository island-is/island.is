import type { FormText } from '@island.is/application/types'
import type { BoxProps } from '@island.is/island-ui/core/types'
import type {
  MessageDescriptor,
  ResolvePreviewString,
  ScreenIntrospection,
} from '../types/translationWorkspace'

/** Matches `*FormField` wrappers that pass `marginTop` / `marginBottom` / `space` → `paddingTop`. */
export const fieldPreviewLayoutProps = (
  screen: ScreenIntrospection,
): Pick<BoxProps, 'marginTop' | 'marginBottom' | 'paddingTop'> => {
  const props: Pick<BoxProps, 'marginTop' | 'marginBottom' | 'paddingTop'> = {}
  if (screen.marginTop != null) {
    props.marginTop = screen.marginTop as BoxProps['marginTop']
  }
  if (screen.marginBottom != null) {
    props.marginBottom = screen.marginBottom as BoxProps['marginBottom']
  }
  if (screen.paddingTop != null) {
    props.paddingTop = screen.paddingTop as BoxProps['paddingTop']
  }
  return props
}

/**
 * Introspection copies default language strings into `title` / `description` while
 * `messageDescriptors` holds the real message ids. Match on defaultMessage so labels
 * and headings use the same strings as the translation editor (including live edits).
 */
const findDescriptorForStaticText = (
  staticText: string | null | undefined,
  descriptors: MessageDescriptor[],
): MessageDescriptor | undefined => {
  if (staticText == null || staticText === '') {
    return undefined
  }
  return descriptors.find((d) => d.defaultMessage === staticText)
}

/**
 * Reconstruct template `FormText` for ui-fields preview so `formatTextWithLocale`
 * resolves via message id (and Translation Workspace intl overrides), not raw strings.
 */
export const staticTextToFormText = (
  staticText: string | null | undefined,
  descriptors: MessageDescriptor[],
): FormText => {
  const match = findDescriptorForStaticText(staticText, descriptors)
  if (match) {
    return {
      id: match.id,
      defaultMessage: match.defaultMessage ?? '',
    }
  }
  return staticText ?? ''
}

export const resolveTranslatableStaticText = (
  staticText: string | null | undefined,
  descriptors: MessageDescriptor[],
  resolvePreviewString: ResolvePreviewString,
): string => {
  const match = findDescriptorForStaticText(staticText, descriptors)
  if (match) {
    return resolvePreviewString(match.id, match.defaultMessage)
  }
  return staticText ?? ''
}

export const resolvePreviewLabel = (
  screen: ScreenIntrospection,
  resolvePreviewString: ResolvePreviewString,
): string => {
  if (screen.title != null && screen.title !== '') {
    return resolveTranslatableStaticText(
      screen.title,
      screen.messageDescriptors,
      resolvePreviewString,
    )
  }
  if (screen.description != null && screen.description !== '') {
    return resolveTranslatableStaticText(
      screen.description,
      screen.messageDescriptors,
      resolvePreviewString,
    )
  }
  /** No duplicate field id in preview — parent MULTI_FIELD / screen title already carries headings. */
  return ''
}

export const MARKDOWN_MESSAGE_ID_SUFFIX = '#markdown'

export const isMarkdownMessageId = (messageId: string) =>
  messageId.endsWith(MARKDOWN_MESSAGE_ID_SUFFIX)
