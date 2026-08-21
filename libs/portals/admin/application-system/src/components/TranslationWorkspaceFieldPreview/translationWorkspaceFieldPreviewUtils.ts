import { FieldTypes } from '@island.is/application/types'
import type { CustomField } from '@island.is/application/types'
import type { ScreenIntrospection } from '../../types/translationWorkspace'
import {
  HALF_WIDTH_IGNORED_TYPES,
  TEXT_DISPLAY_TYPES_ALWAYS_MARKDOWN,
} from '../../utils/translationWorkspaceFieldConstants'
import { isMarkdownMessageId } from '../../utils/translationWorkspaceStaticText'

export const inferTranslationWorkspaceShowFieldName = (
  screen: ScreenIntrospection,
): boolean => {
  if (screen.type === FieldTypes.RADIO || screen.type === FieldTypes.CHECKBOX) {
    return false
  }
  if (
    screen.type === FieldTypes.TITLE ||
    screen.type === FieldTypes.DIVIDER ||
    screen.type === FieldTypes.ALERT_MESSAGE ||
    screen.type === FieldTypes.LINK ||
    screen.type === FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD
  ) {
    return false
  }
  if (screen.type === FieldTypes.DESCRIPTION) {
    return Boolean(screen.title)
  }
  return true
}

export const buildMockCustomField = (
  screen: ScreenIntrospection,
): CustomField => {
  return {
    id: screen.id,
    type: FieldTypes.CUSTOM,
    component: screen.component ?? '',
    title: screen.title ?? '',
    children: undefined,
    props: {},
  }
}

export const staticTableTitleVariantToText = (
  v: string | null | undefined,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' => {
  if (v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' || v === 'h5') {
    return v
  }
  return 'h4'
}

export const descriptionTitleVariantToText = (
  v: string | null | undefined,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' => {
  if (v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' || v === 'h5') {
    return v
  }
  return 'h3'
}

/** First breakpoint value for translation preview (matches `ImageFormField` mobile-first idea). */
export const previewImageFieldWidthCss = (raw: unknown): string => {
  const first = Array.isArray(raw) ? raw[0] : raw
  if (first === 'full') return '100%'
  if (first === '50%') return '50%'
  if (first === 'auto') return 'auto'
  if (typeof first === 'string') return first
  return '100%'
}

export const previewImageFieldJustifyContent = (
  raw: unknown,
): 'flexStart' | 'center' | 'flexEnd' => {
  const first = Array.isArray(raw) ? raw[0] : raw
  if (first === 'center') return 'center'
  if (first === 'right') return 'flexEnd'
  return 'flexStart'
}

export const getTableRepeaterFormFieldSpan = (
  child: ScreenIntrospection,
): '1/1' | '1/2' | '1/3' => {
  if (!HALF_WIDTH_IGNORED_TYPES.has(child.type) && child.width === 'half') {
    return '1/2'
  }
  if (child.width === 'third') {
    return '1/3'
  }
  return '1/1'
}

export const previewStringUsesMarkdown = (
  screenType: string,
  messageId: string,
): boolean =>
  isMarkdownMessageId(messageId) ||
  TEXT_DISPLAY_TYPES_ALWAYS_MARKDOWN.has(screenType)
