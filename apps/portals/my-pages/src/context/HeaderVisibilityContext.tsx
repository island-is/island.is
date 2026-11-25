import { ReactNode, createContext, useContext, useMemo, useState } from 'react'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM } from '@island.is/portals/my-pages/constants'

interface HeaderVisibilityContextType {
  headerVisible: boolean
  setHeaderVisible: (visible: boolean) => void
  /**
   * Measured height of the fixed header element, including anything
   * rendered inside it (e.g. the delegation banner).
   */
  headerHeight: number
  setHeaderHeight: (height: number) => void
  /**
   * While the mobile search overlay is open, the page content behind it is
   * made inert so focus and screen readers stay in the header and overlay.
   */
  searchMenuOpen: boolean
  setSearchMenuOpen: (open: boolean) => void
}

const HeaderVisibilityContext = createContext<
  HeaderVisibilityContextType | undefined
>(undefined)

export const HeaderVisibilityProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [headerVisible, setHeaderVisible] = useState<boolean>(true)
  const [headerHeight, setHeaderHeight] = useState<number>(
    SERVICE_PORTAL_HEADER_HEIGHT_SM,
  )
  const [searchMenuOpen, setSearchMenuOpen] = useState<boolean>(false)

  const value = useMemo(
    () => ({
      headerVisible,
      setHeaderVisible,
      headerHeight,
      setHeaderHeight,
      searchMenuOpen,
      setSearchMenuOpen,
    }),
    [headerVisible, headerHeight, searchMenuOpen],
  )

  return (
    <HeaderVisibilityContext.Provider value={value}>
      {children}
    </HeaderVisibilityContext.Provider>
  )
}

export const useHeaderVisibility = () => {
  const context = useContext(HeaderVisibilityContext)
  if (!context) {
    throw new Error(
      'useHeaderVisibility must be used within a HeaderVisibilityProvider',
    )
  }
  return context
}
