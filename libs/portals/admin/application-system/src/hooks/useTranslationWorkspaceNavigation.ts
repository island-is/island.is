import { useCallback, useEffect, useState } from 'react'
import type {
  ScreenIntrospection,
  SidebarNavLocation,
  WorkspaceTemplateIntrospection,
} from '../types/translationWorkspace'
import { findInitialSidebarSelection } from '../utils/translationWorkspaceSelection'

type UseTranslationWorkspaceNavigationArgs = {
  introspection: WorkspaceTemplateIntrospection | null
  typeId: string | undefined
  isCompactNav: boolean
}

export const useTranslationWorkspaceNavigation = ({
  introspection,
  isCompactNav,
}: UseTranslationWorkspaceNavigationArgs) => {
  const [selectedScreen, setSelectedScreen] =
    useState<ScreenIntrospection | null>(null)
  const [selectedLocation, setSelectedLocation] =
    useState<SidebarNavLocation | null>(null)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  const handleSidebarNavClick = useCallback(
    (nav: ScreenIntrospection, location: SidebarNavLocation) => {
      if (!introspection) return

      setNavDrawerOpen(false)
      setSelectedScreen(nav)
      setSelectedLocation(location)
    },
    [introspection],
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
