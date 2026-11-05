import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  ScreenIntrospection,
  SidebarNavLocation,
  WorkspaceTemplateIntrospection,
} from '../types/translationWorkspace'
import {
  findInitialSidebarSelection,
  flattenNavEntries,
  isSameSidebarLocation,
} from '../utils/translationWorkspaceSelection'

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

  const navEntries = useMemo(
    () => (introspection ? flattenNavEntries(introspection) : []),
    [introspection],
  )

  const currentEntryIndex = useMemo(() => {
    if (!selectedLocation) return -1
    return navEntries.findIndex((entry) =>
      isSameSidebarLocation(selectedLocation, entry.location),
    )
  }, [navEntries, selectedLocation])

  const hasPreviousScreen = currentEntryIndex > 0
  const hasNextScreen =
    currentEntryIndex >= 0 && currentEntryIndex < navEntries.length - 1

  const goToPreviousScreen = () => {
    if (!hasPreviousScreen) return
    const entry = navEntries[currentEntryIndex - 1]
    handleSidebarNavClick(entry.nav, entry.location)
  }

  const goToNextScreen = () => {
    if (!hasNextScreen) return
    const entry = navEntries[currentEntryIndex + 1]
    handleSidebarNavClick(entry.nav, entry.location)
  }

  return {
    selectedScreen,
    selectedLocation,
    navDrawerOpen,
    openNavDrawer,
    closeNavDrawer,
    handleSidebarNavClick,
    handleNavDrawerVisibilityChange,
    hasPreviousScreen,
    hasNextScreen,
    goToPreviousScreen,
    goToNextScreen,
  }
}
