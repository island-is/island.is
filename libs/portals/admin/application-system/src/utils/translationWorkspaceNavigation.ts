import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  TemplateStateNav,
} from '../types/translationWorkspace'

/** Deduped union of `messageDescriptors` on each screen (already flattened for multifields on the API). */
export const mergeScreensMessageDescriptors = (
  screens: ScreenIntrospection[],
): MessageDescriptor[] => {
  const seen = new Set<string>()
  const out: MessageDescriptor[] = []
  for (const screen of screens) {
    for (const d of screen.messageDescriptors) {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        out.push(d)
      }
    }
    for (const d of screen.tableRepeaterColumnHeaders ?? []) {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        out.push(d)
      }
    }
    for (const d of screen.staticTableHeaderDescriptors ?? []) {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        out.push(d)
      }
    }
    for (const d of screen.staticTableRowCellDescriptors ?? []) {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        out.push(d)
      }
    }
    for (const row of screen.staticTableSummary ?? []) {
      for (const d of [row.label, row.value]) {
        if (!seen.has(d.id)) {
          seen.add(d.id)
          out.push(d)
        }
      }
    }
  }
  return out
}

/** One sidebar entry for a whole section (matches stepper when there are no subsections). */
export const buildSectionNavigationScreen = (
  sectionId: string,
  title: string | null | undefined,
  titleMessageDescriptor: MessageDescriptor | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => ({
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
  messageDescriptors: [
    ...(titleMessageDescriptor ? [titleMessageDescriptor] : []),
    ...mergeScreensMessageDescriptors(screens),
  ],
})

/** One sidebar entry per subsection (matches stepper subsection tabs). */
export const buildSubSectionNavigationScreen = (
  subSectionId: string,
  title: string | null | undefined,
  titleMessageDescriptor: MessageDescriptor | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => ({
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
  messageDescriptors: [
    ...(titleMessageDescriptor ? [titleMessageDescriptor] : []),
    ...mergeScreensMessageDescriptors(screens),
  ],
})

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
): TranslationCount => {
  let translated = 0
  for (const d of descriptors) {
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
  return { translated, total: descriptors.length }
}

const collectAllScreensForRole = (
  role: TemplateStateNav['roles'][number],
): ScreenIntrospection[] => {
  if (!role.form) return []
  const all: ScreenIntrospection[] = []
  for (const section of role.form.sections) {
    all.push(...(section.screens as ScreenIntrospection[]))
    for (const sub of section.subSections) {
      all.push(...(sub.screens as ScreenIntrospection[]))
    }
  }
  return all
}

export const countTranslationsForState = (
  state: TemplateStateNav,
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
): TranslationCount => {
  const allScreens = state.roles.flatMap(collectAllScreensForRole)
  const descriptors = mergeScreensMessageDescriptors(allScreens)
  return countTranslatedDescriptors(
    descriptors,
    persistedByKey,
    editedValues,
    activeLocale,
  )
}

export const countTranslationsForRole = (
  role: TemplateStateNav['roles'][number],
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
): TranslationCount => {
  const allScreens = collectAllScreensForRole(role)
  const descriptors = mergeScreensMessageDescriptors(allScreens)
  return countTranslatedDescriptors(
    descriptors,
    persistedByKey,
    editedValues,
    activeLocale,
  )
}

export const countTranslationsForScreens = (
  screens: ScreenIntrospection[],
  persistedByKey: Record<string, { valueIs: string; valueEn?: string | null }>,
  editedValues: EditedTranslations,
  activeLocale: 'is' | 'en',
): TranslationCount => {
  const descriptors = mergeScreensMessageDescriptors(screens)
  return countTranslatedDescriptors(
    descriptors,
    persistedByKey,
    editedValues,
    activeLocale,
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
