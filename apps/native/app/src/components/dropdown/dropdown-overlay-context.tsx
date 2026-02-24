import React, { createContext, ReactNode, useContext } from 'react'

interface DropdownOverlayContextValue {
  componentId?: string
  close: () => void
}

const DropdownOverlayContext =
  createContext<DropdownOverlayContextValue | null>(null)

export const DropdownOverlayProvider = ({
  value,
  children,
}: {
  value: DropdownOverlayContextValue
  children: ReactNode
}) => {
  return (
    <DropdownOverlayContext.Provider value={value}>
      {children}
    </DropdownOverlayContext.Provider>
  )
}

export const useDropdownOverlay = () => useContext(DropdownOverlayContext)
