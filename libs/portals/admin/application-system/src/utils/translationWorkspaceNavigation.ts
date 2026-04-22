import type { MessageDescriptor, ScreenIntrospection } from '../types/translationWorkspace'

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
  screens: ScreenIntrospection[],
): ScreenIntrospection => ({
  id: `__navigation:section:${sectionId}`,
  type: 'SECTION_NAV_GROUP',
  title: title ?? sectionId,
  description: null,
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors(screens),
})

/** One sidebar entry per subsection (matches stepper subsection tabs). */
export const buildSubSectionNavigationScreen = (
  subSectionId: string,
  title: string | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => ({
  id: `__navigation:subsection:${subSectionId}`,
  type: 'SUBSECTION_NAV_GROUP',
  title: title ?? subSectionId,
  description: null,
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors(screens),
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
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors([screen]),
})

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
