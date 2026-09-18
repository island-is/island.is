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

export const findInitialSidebarSelection = (
  introspection: Pick<WorkspaceTemplateIntrospection, 'states'>,
): { nav: ScreenIntrospection; location: SidebarNavLocation } | null => {
  for (const state of introspection.states as TemplateStateNav[]) {
    for (const role of state.roles) {
      if (!role.form) continue
      for (const section of role.form.sections) {
        const subs = section.subSections as Array<{
          id: string
          title?: string | null
          titleMessageDescriptor?: MessageDescriptor | null
          screens: ScreenIntrospection[]
        }>
        if (subs.length > 0) {
          const firstSub = subs.find(
            (item) => (item.screens as ScreenIntrospection[]).length > 0,
          )
          if (firstSub) {
            const screens = firstSub.screens as ScreenIntrospection[]
            return {
              nav: buildSubSectionNavigationScreen(
                firstSub.id,
                firstSub.title,
                firstSub.titleMessageDescriptor,
                screens,
              ),
              location: {
                stateKey: state.stateKey,
                stateName: state.stateName,
                roleId: role.roleId,
                sectionId: section.id,
                sectionTitle: section.title,
                subsectionId: firstSub.id,
                subsectionTitle: firstSub.title,
              },
            }
          }
        }
        const screens = section.screens as ScreenIntrospection[]
        if (screens.length > 0) {
          return {
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
          }
        }
      }
    }
  }
  return null
}
