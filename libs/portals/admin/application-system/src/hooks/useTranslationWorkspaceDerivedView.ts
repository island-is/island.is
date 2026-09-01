import { useMemo } from 'react'
import type {
  MessageDescriptor,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateSectionNav,
  ValidationMessageDescriptor,
  WorkspaceTemplateIntrospection,
} from '../types/translationWorkspace'
import { findFooterSubmitScreen } from '../utils/translationWorkspaceFooterSubmit'
import {
  collectScreenMessageDescriptors,
  getActiveForm,
  getPreviewScreens,
  groupValidationDescriptorsByPath,
} from '../utils/translationWorkspaceSelection'

type UseTranslationWorkspaceDerivedViewArgs = {
  introspection: WorkspaceTemplateIntrospection | null
  selectedLocation: SidebarNavLocation | null
  selectedScreen: ScreenIntrospection | null
}

export const useTranslationWorkspaceDerivedView = ({
  introspection,
  selectedLocation,
  selectedScreen,
}: UseTranslationWorkspaceDerivedViewArgs) => {
  const activeForm = useMemo(
    () => getActiveForm(introspection, selectedLocation),
    [introspection, selectedLocation],
  )

  const previewScreens = useMemo(
    () => getPreviewScreens(introspection, selectedLocation),
    [introspection, selectedLocation],
  )

  const footerSubmitScreen = useMemo(
    () => findFooterSubmitScreen(previewScreens),
    [previewScreens],
  )

  const screenMessageDescriptors = useMemo(
    () => collectScreenMessageDescriptors(selectedScreen),
    [selectedScreen],
  )

  const allApplicationMessageDescriptors = useMemo(
    () => (introspection?.allMessageDescriptors ?? []) as MessageDescriptor[],
    [introspection],
  )

  const validationDescriptors = useMemo(
    (): ValidationMessageDescriptor[] =>
      (introspection?.validationMessageDescriptors ??
        []) as ValidationMessageDescriptor[],
    [introspection],
  )

  const validationDescriptorsByPath = useMemo(
    () => groupValidationDescriptorsByPath(validationDescriptors),
    [validationDescriptors],
  )

  return {
    activeForm,
    activeSections: (activeForm?.sections ?? []) as TemplateSectionNav[],
    activeFormTitle: activeForm?.title ?? null,
    previewScreens,
    footerSubmitScreen,
    screenMessageDescriptors,
    allApplicationMessageDescriptors,
    validationDescriptors,
    validationDescriptorsByPath,
    activeStateKey: selectedLocation?.stateKey ?? '',
    activeStateName: selectedLocation?.stateName ?? '',
    activeRoleId: selectedLocation?.roleId ?? '',
  }
}
