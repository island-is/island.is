import { useMemo } from 'react'
import {
  filterOwnedTranslationDescriptors,
  getOwnedTranslationNamespaces,
} from '@island.is/application/utils'
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
  const ownedNamespaces = useMemo(
    () =>
      getOwnedTranslationNamespaces(introspection?.translationNamespaces ?? []),
    [introspection],
  )

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
    () =>
      filterOwnedTranslationDescriptors(
        collectScreenMessageDescriptors(selectedScreen),
        ownedNamespaces,
      ),
    [selectedScreen, ownedNamespaces],
  )

  const previewCatalogDescriptors = useMemo(
    () => (introspection?.allMessageDescriptors ?? []) as MessageDescriptor[],
    [introspection],
  )

  const allApplicationMessageDescriptors = useMemo(
    () =>
      filterOwnedTranslationDescriptors(
        previewCatalogDescriptors,
        ownedNamespaces,
      ),
    [previewCatalogDescriptors, ownedNamespaces],
  )

  const validationDescriptors = useMemo((): ValidationMessageDescriptor[] => {
    const all = (introspection?.validationMessageDescriptors ??
      []) as ValidationMessageDescriptor[]
    return filterOwnedTranslationDescriptors(all, ownedNamespaces)
  }, [introspection, ownedNamespaces])

  const validationDescriptorsByPath = useMemo(
    () =>
      groupValidationDescriptorsByPath(
        (introspection?.validationMessageDescriptors ??
          []) as ValidationMessageDescriptor[],
      ),
    [introspection],
  )

  return {
    ownedNamespaces,
    activeForm,
    activeSections: (activeForm?.sections ?? []) as TemplateSectionNav[],
    activeFormTitle: activeForm?.title ?? null,
    previewScreens,
    footerSubmitScreen,
    screenMessageDescriptors,
    allApplicationMessageDescriptors,
    previewCatalogDescriptors,
    validationDescriptors,
    validationDescriptorsByPath,
    activeStateKey: selectedLocation?.stateKey ?? '',
    activeStateName: selectedLocation?.stateName ?? '',
    activeRoleId: selectedLocation?.roleId ?? '',
  }
}
