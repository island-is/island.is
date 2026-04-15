'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface HeaderInfo {
  institutionName?: string
  applicationName?: string
}

interface HeaderInfoContextType {
  info: HeaderInfo
  setInfo: (info: HeaderInfo) => void
  clearInfo: () => void
}

const HeaderInfoContext = createContext<HeaderInfoContextType>({
  info: {},
  setInfo: () => undefined,
  clearInfo: () => undefined,
})

export function HeaderInfoProvider({ children }: { children: React.ReactNode }) {
  const [info, setInfoState] = useState<HeaderInfo>({})

  const setInfo = useCallback((next: HeaderInfo) => {
    setInfoState(next)
  }, [])

  const clearInfo = useCallback(() => {
    setInfoState({})
  }, [])

  return (
    <HeaderInfoContext.Provider value={{ info, setInfo, clearInfo }}>
      {children}
    </HeaderInfoContext.Provider>
  )
}

export function useHeaderInfo() {
  return useContext(HeaderInfoContext)
}
