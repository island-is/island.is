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
export const resolveTranslatableStaticText = (
  staticText: string | null | undefined,
  descriptors: MessageDescriptor[],
  resolvePreviewString: ResolvePreviewString,
): string => {
  if (staticText == null || staticText === '') {
    return ''
  }
  const match = descriptors.find((d) => d.defaultMessage === staticText)
  if (match) {
    return resolvePreviewString(match.id, match.defaultMessage)
  }
  return staticText
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
  return screen.id
}

export const MARKDOWN_MESSAGE_ID_SUFFIX = '#markdown'

export const isMarkdownMessageId = (messageId: string) =>
  messageId.endsWith(MARKDOWN_MESSAGE_ID_SUFFIX)
