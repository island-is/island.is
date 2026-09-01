import { useCallback, useEffect, useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useGetApplicationTemplateRoleFormLazyQuery } from '../queries/translations.generated'
import type {
  ScreenIntrospection,
  SidebarNavLocation,
  WorkspaceTemplateIntrospection,
} from '../types/translationWorkspace'
import { shortenForToast } from '../utils/translationWorkspaceErrors'
import { findInitialSidebarSelection } from '../utils/translationWorkspaceSelection'

type UseTranslationWorkspaceNavigationArgs = {
  introspection: WorkspaceTemplateIntrospection | null
  typeId: string | undefined
  isCompactNav: boolean
}

export const useTranslationWorkspaceNavigation = ({
  introspection,
  typeId,
  isCompactNav,
}: UseTranslationWorkspaceNavigationArgs) => {
  const [selectedScreen, setSelectedScreen] =
    useState<ScreenIntrospection | null>(null)
  const [selectedLocation, setSelectedLocation] =
    useState<SidebarNavLocation | null>(null)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const [fetchRoleForm] = useGetApplicationTemplateRoleFormLazyQuery()

  const handleSidebarNavClick = useCallback(
    (nav: ScreenIntrospection, location: SidebarNavLocation) => {
      if (!introspection) return

      setNavDrawerOpen(false)

      const resolvedTypeId = introspection.typeId ?? typeId ?? ''

      void fetchRoleForm({
        variables: {
          typeId: resolvedTypeId,
          stateKey: location.stateKey,
          roleId: location.roleId,
        },
        fetchPolicy: 'network-only',
      }).then((result) => {
        if (result.error) {
          console.error(
            '[TranslationWorkspace] loadRoleForm (formLoader) failed',
            result.error,
          )
          toast.error(
            shortenForToast(
              result.error.message ?? 'Could not load form from server',
            ),
          )
          return
        }
        console.log(
          '[TranslationWorkspace] form from formLoader (serialized JSON)',
          {
            template: {
              typeId: resolvedTypeId,
              name: introspection.name,
              slug: introspection.slug,
            },
            location,
            nav,
            form: result.data?.applicationTemplateRoleForm,
          },
        )
      })

      setSelectedScreen(nav)
      setSelectedLocation(location)
    },
    [introspection, typeId, fetchRoleForm],
  )

  const closeNavDrawer = useCallback(() => {
    setNavDrawerOpen(false)
  }, [])

  const openNavDrawer = useCallback(() => {
    setNavDrawerOpen(true)
  }, [])

  const handleNavDrawerVisibilityChange = useCallback((visible: boolean) => {
    if (!visible) {
      setNavDrawerOpen(false)
    }
  }, [])

  useEffect(() => {
    if (!isCompactNav) {
      setNavDrawerOpen(false)
    }
  }, [isCompactNav])

  useEffect(() => {
    if (!introspection || selectedScreen) return
    const initial = findInitialSidebarSelection(introspection)
    if (initial) {
      handleSidebarNavClick(initial.nav, initial.location)
    }
  }, [introspection, selectedScreen, handleSidebarNavClick])

  return {
    selectedScreen,
    selectedLocation,
    navDrawerOpen,
    openNavDrawer,
    closeNavDrawer,
    handleSidebarNavClick,
    handleNavDrawerVisibilityChange,
  }
}
