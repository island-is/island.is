import { isOwnedTranslationMessageId } from '@island.is/application/utils'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  TemplateStateNav,
} from '../types/translationWorkspace'

/** GraphQL codegen uses `string | null`; domain `MessageDescriptor` uses `string | undefined`. */
type GraphqlMessageDescriptor = {
  id: string
  defaultMessage?: string | null
  description?: string | null
}

const toMessageDescriptor = (
  descriptor?: GraphqlMessageDescriptor | null,
): MessageDescriptor | undefined => {
  if (!descriptor) {
    return undefined
  }

  return {
    id: descriptor.id,
    defaultMessage: descriptor.defaultMessage ?? undefined,
    description: descriptor.description ?? undefined,
  }
}

export const mergeMessageDescriptorLists = (
  ...lists: Array<readonly MessageDescriptor[] | undefined>
): MessageDescriptor[] => {
  const seen = new Set<string>()
  const out: MessageDescriptor[] = []
  for (const list of lists) {
    for (const descriptor of list ?? []) {
      if (!seen.has(descriptor.id)) {
        seen.add(descriptor.id)
        out.push(descriptor)
      }
    }
  }
  return out
}

/** Deduped union of `messageDescriptors` on each screen (already flattened for multifields on the API). */
export const mergeScreensMessageDescriptors = (
  screens: ScreenIntrospection[],
): MessageDescriptor[] => {
  const lists: MessageDescriptor[][] = []
  for (const screen of screens) {
    lists.push(screen.messageDescriptors)
    lists.push(screen.tableRepeaterColumnHeaders ?? [])
    lists.push(screen.staticTableHeaderDescriptors ?? [])
    lists.push(screen.staticTableRowCellDescriptors ?? [])
    for (const row of screen.staticTableSummary ?? []) {
      lists.push([row.label, row.value])
    }
  }
  return mergeMessageDescriptorLists(...lists)
}

/** Same descriptors the sidebar strings tab shows for a section/subsection nav item. */
export const descriptorsForSectionNavigation = (
  titleMessageDescriptor: GraphqlMessageDescriptor | null | undefined,
  screens: ScreenIntrospection[],
): MessageDescriptor[] => {
  const titleDescriptor = toMessageDescriptor(titleMessageDescriptor)
  return mergeMessageDescriptorLists(
    titleDescriptor ? [titleDescriptor] : [],
    mergeScreensMessageDescriptors(screens),
  )
}

/** One sidebar entry for a whole section (matches stepper when there are no subsections). */
export const buildSectionNavigationScreen = (
  sectionId: string,
  title: string | null | undefined,
  titleMessageDescriptor: GraphqlMessageDescriptor | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => {
  return {
    id: `__navigation:section:${sectionId}`,
    type: 'SECTION_NAV_GROUP',
    title: title ?? sectionId,
    description: null,
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    messageDescriptors: descriptorsForSectionNavigation(
      titleMessageDescriptor,
      screens,
    ),
  }
}

/** One sidebar entry per subsection (matches stepper subsection tabs). */
export const buildSubSectionNavigationScreen = (
  subSectionId: string,
  title: string | null | undefined,
  titleMessageDescriptor: GraphqlMessageDescriptor | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => {
  return {
    id: `__navigation:subsection:${subSectionId}`,
    type: 'SUBSECTION_NAV_GROUP',
    title: title ?? subSectionId,
    description: null,
    pageTitle: null,
    subTitle: null,
    subDescription: null,
    checkboxLabel: null,
    width: null,
    space: null,
    messageDescriptors: descriptorsForSectionNavigation(
      titleMessageDescriptor,
      screens,
    ),
  }
}

/**
 * Section-level leaf not under a subsection (uncommon). Keeps translations for that leaf only,
 * labeled by the leaf title so the sidebar stays usable if both patterns appear in one section.
 */
export const buildSectionLeafNavigationScreen = (
  sectionId: string,
  screen: ScreenIntrospection,
): ScreenIntrospection => ({
  id: `__navigation:sectionLeaf:${sectionId}:${screen.id}`,
  type: 'SECTION_LEAF_NAV_GROUP',
  title: screen.title ?? screen.id,
  description: null,
  pageTitle: null,
  subTitle: null,
  subDescription: null,
  checkboxLabel: null,
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors([screen]),
})

export interface TranslationCount {
  translated: number
  total: number
}

export const countTranslatedDescriptors = (
  descriptors: MessageDescriptor[],
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
  ownedNamespaces: readonly string[] = [],
): TranslationCount => {
  const countable =
    ownedNamespaces.length > 0
      ? descriptors.filter((descriptor) =>
          isOwnedTranslationMessageId(descriptor.id, ownedNamespaces),
        )
      : descriptors
  let translated = 0
  for (const d of countable) {
    const edited = editedValues[activeLocale][d.id]
    if (edited !== undefined && edited !== '') {
      translated++
      continue
    }
    const persisted = persistedByKey[d.id]
    if (persisted) {
      const value =
        activeLocale === 'en' ? persisted.valueEn : persisted.valueIs
      if (value && value !== '') {
        translated++
      }
    }
  }
  return { translated, total: countable.length }
}

export const collectRoleMessageDescriptors = (
  role: TemplateStateNav['roles'][number],
): MessageDescriptor[] => {
  if (!role.form) return []
  const lists: MessageDescriptor[][] = []
  for (const section of role.form.sections) {
    lists.push(
      descriptorsForSectionNavigation(
        section.titleMessageDescriptor,
        section.screens as ScreenIntrospection[],
      ),
    )
    for (const sub of section.subSections) {
      lists.push(
        descriptorsForSectionNavigation(
          sub.titleMessageDescriptor,
          sub.screens as ScreenIntrospection[],
        ),
      )
    }
  }
  return mergeMessageDescriptorLists(...lists)
}

export const countTranslationsForState = (
  state: TemplateStateNav,
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
  ownedNamespaces: readonly string[] = [],
): TranslationCount => {
  const descriptors = mergeMessageDescriptorLists(
    ...state.roles.map(collectRoleMessageDescriptors),
  )
  return countTranslatedDescriptors(
    descriptors,
    persistedByKey,
    editedValues,
    activeLocale,
    ownedNamespaces,
  )
}

export const countTranslationsForRole = (
  role: TemplateStateNav['roles'][number],
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
  ownedNamespaces: readonly string[] = [],
): TranslationCount => {
  return countTranslatedDescriptors(
    collectRoleMessageDescriptors(role),
    persistedByKey,
    editedValues,
    activeLocale,
    ownedNamespaces,
  )
}

export const countTranslationsForScreens = (
  screens: ScreenIntrospection[],
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
  ownedNamespaces: readonly string[] = [],
  extraDescriptors: readonly MessageDescriptor[] = [],
): TranslationCount => {
  const descriptors = mergeMessageDescriptorLists(
    extraDescriptors,
    mergeScreensMessageDescriptors(screens),
  )
  return countTranslatedDescriptors(
    descriptors,
    persistedByKey,
    editedValues,
    activeLocale,
    ownedNamespaces,
  )
}

/** Sidebar label for a template role's form (accordion). */
export const getRoleFormAccordionLabel = (roleId: string): string => {
  switch (roleId.toLowerCase()) {
    case 'applicant':
      return 'Applicant form'
    case 'delegate':
      return 'Delegate form'
    default: {
      const rest = roleId.slice(1)
      const initial = roleId.charAt(0).toUpperCase()
      return `${initial}${rest} form`
    }
  }
}
