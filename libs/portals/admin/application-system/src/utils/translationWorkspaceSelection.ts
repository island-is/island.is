import type {
  MessageDescriptor,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateFormNav,
  TemplateStateNav,
  ValidationMessageDescriptor,
  WorkspaceTemplateIntrospection,
} from '../types/translationWorkspace'
import { PREVIEW_EXCLUDED_FIELD_TYPES } from './translationWorkspaceFieldConstants'
import {
  buildSectionLeafNavigationScreen,
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
} from './translationWorkspaceNavigation'

const excludeHiddenScreens = (
  screens: ScreenIntrospection[],
): ScreenIntrospection[] =>
  screens.filter((screen) => !PREVIEW_EXCLUDED_FIELD_TYPES.has(screen.type))

export const getActiveForm = (
  introspection: WorkspaceTemplateIntrospection | null,
  selectedLocation: SidebarNavLocation | null,
): TemplateFormNav | null => {
  if (!selectedLocation || !introspection) return null
  const state = introspection.states.find(
    (item) => item.stateKey === selectedLocation.stateKey,
  )
  const role = state?.roles.find(
    (item) => item.roleId === selectedLocation.roleId,
  )
  return role?.form ?? null
}

export const getPreviewScreens = (
  introspection: WorkspaceTemplateIntrospection | null,
  selectedLocation: SidebarNavLocation | null,
): ScreenIntrospection[] => {
  if (!selectedLocation || !introspection) return []
  const state = introspection.states.find(
    (item) => item.stateKey === selectedLocation.stateKey,
  )
  const role = state?.roles.find(
    (item) => item.roleId === selectedLocation.roleId,
  )
  const section = role?.form?.sections.find(
    (item) => item.id === selectedLocation.sectionId,
  )
  if (!section) return []

  if (selectedLocation.leafSourceScreenId) {
    const screen = (section.screens as ScreenIntrospection[]).find(
      (item) => item.id === selectedLocation.leafSourceScreenId,
    )
    return screen && !PREVIEW_EXCLUDED_FIELD_TYPES.has(screen.type)
      ? [screen]
      : []
  }
  if (selectedLocation.subsectionId) {
    const sub = section.subSections.find(
      (item) => item.id === selectedLocation.subsectionId,
    )
    return excludeHiddenScreens((sub?.screens ?? []) as ScreenIntrospection[])
  }
  return excludeHiddenScreens([
    ...(section.screens as ScreenIntrospection[]),
    ...section.subSections.flatMap(
      (item) => item.screens as ScreenIntrospection[],
    ),
  ])
}

export const collectScreenMessageDescriptors = (
  selectedScreen: ScreenIntrospection | null,
): MessageDescriptor[] => {
  if (!selectedScreen) return []
  const all = [...selectedScreen.messageDescriptors]
  if (selectedScreen.children) {
    for (const child of selectedScreen.children) {
      all.push(...child.messageDescriptors)
    }
  }
  return all
}

export const groupValidationDescriptorsByPath = (
  descriptors: ValidationMessageDescriptor[],
): Record<string, ValidationMessageDescriptor[]> => {
  const map: Record<string, ValidationMessageDescriptor[]> = {}
  for (const descriptor of descriptors) {
    const key = descriptor.fieldPath
    if (!map[key]) map[key] = []
    map[key].push(descriptor)
  }
  return map
}

export interface WorkspaceNavEntry {
  nav: ScreenIntrospection
  location: SidebarNavLocation
}

export const flattenNavEntries = (
  introspection: Pick<WorkspaceTemplateIntrospection, 'states'>,
): WorkspaceNavEntry[] => {
  const entries: WorkspaceNavEntry[] = []

  for (const state of introspection.states as TemplateStateNav[]) {
    for (const role of state.roles) {
      if (!role.form) continue
      for (const section of role.form.sections) {
        const screens = section.screens as ScreenIntrospection[]
        const subSections = section.subSections as Array<{
          id: string
          title?: string | null
          titleMessageDescriptor?: MessageDescriptor | null
          screens: ScreenIntrospection[]
        }>

        if (subSections.length === 0) {
          if (excludeHiddenScreens(screens).length > 0) {
            entries.push({
              nav: buildSectionNavigationScreen(
                section.id,
                section.title,
                section.titleMessageDescriptor,
                screens,
              ),
              location: {
                stateKey: state.stateKey,
                stateName: state.stateName,
                roleId: role.roleId,
                sectionId: section.id,
                sectionTitle: section.title,
              },
            })
          }
          continue
        }

        for (const sub of subSections) {
          const subScreens = sub.screens as ScreenIntrospection[]
          if (excludeHiddenScreens(subScreens).length === 0) continue
          entries.push({
            nav: buildSubSectionNavigationScreen(
              sub.id,
              sub.title,
              sub.titleMessageDescriptor,
              subScreens,
            ),
            location: {
              stateKey: state.stateKey,
              stateName: state.stateName,
              roleId: role.roleId,
              sectionId: section.id,
              sectionTitle: section.title,
              subsectionId: sub.id,
              subsectionTitle: sub.title,
            },
          })
        }

        for (const screen of screens) {
          if (PREVIEW_EXCLUDED_FIELD_TYPES.has(screen.type)) continue
          entries.push({
            nav: buildSectionLeafNavigationScreen(section.id, screen),
            location: {
              stateKey: state.stateKey,
              stateName: state.stateName,
              roleId: role.roleId,
              sectionId: section.id,
              sectionTitle: section.title,
              leafSourceScreenId: screen.id,
            },
          })
        }
      }
    }
  }

  return entries
}

export const findInitialSidebarSelection = (
  introspection: Pick<WorkspaceTemplateIntrospection, 'states'>,
): WorkspaceNavEntry | null => flattenNavEntries(introspection)[0] ?? null
