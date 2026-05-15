import type { ScreenIntrospection } from '../types/translationWorkspace'

export const INPUT_FIELD_TYPES = new Set([
  'TEXT',
  'PHONE',
  'EMAIL',
  'BANK_ACCOUNT',
  'COMPANY_SEARCH',
  'ASYNC_SELECT',
  'COPY_LINK',
  'HIDDEN_INPUT',
  'HIDDEN_INPUT_WITH_WATCHED_VALUE',
  'FIND_VEHICLE',
  'VEHICLE_PERMNO_WITH_INFO',
])

export const TEXT_DISPLAY_TYPES = new Set([
  'DESCRIPTION',
  'TITLE',
  'EXPANDABLE_DESCRIPTION',
  'LINK',
  'MESSAGE_WITH_LINK_BUTTON_FIELD',
  'INFORMATION_CARD',
  'DISPLAY',
  'ACCORDION',
])

/**
 * These field types always pass copy through `<Markdown>` in `@island.is/application/ui-fields`.
 * Preview must do the same — message ids are not required to end with `#markdown`.
 */
export const TEXT_DISPLAY_TYPES_ALWAYS_MARKDOWN = new Set([
  'EXPANDABLE_DESCRIPTION',
  'INFORMATION_CARD',
  'ACCORDION',
])

export const PLACEHOLDER_TYPES = new Set([
  'KEY_VALUE',
  'PAGINATED_SEARCHABLE_TABLE',
  'ACTION_CARD_LIST',
  'SLIDER',
  'IMAGE',
  'PDF_LINK_BUTTON',
])

export const noop = () => {
  /* intentionally empty */
}

export const HALF_WIDTH_IGNORED_TYPES = new Set(['RADIO', 'CHECKBOX'])

export const PREVIEW_EXCLUDED_FIELD_TYPES = new Set([
  'HIDDEN_INPUT',
  'HIDDEN_INPUT_WITH_WATCHED_VALUE',
])

/** Island-ui input background: blue by default in translation preview; white only when the template sets `backgroundColor: 'white'`. */
export const previewWorkspaceInputBackgroundColor = (
  screen: Pick<ScreenIntrospection, 'inputBackgroundColor'>,
): 'blue' | 'white' =>
  screen.inputBackgroundColor === 'white' ? 'white' : 'blue'
