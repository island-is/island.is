import React, { createContext, useState } from 'react'
import { getUnreadDocumentsCount } from '@island.is/service-portal/graphql'

// TODO: Set default state!
const defaultState = {
  unreadDocumentsCounter: -1,
}

export const BadgeContext = createContext({
  ...defaultState,
  updateUnreadDocumentsCounter() {
    return void 0
  },
})

export const BadgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadDocumentsCounter, setUnreadDocCounter] = useState<number>(-1)

  function updateUnreadDocumentsCounter() {
    const counter = getUnreadDocumentsCount()
    setUnreadDocCounter(counter)
    return void 0
  }

  return (
    <BadgeContext.Provider
      value={{ unreadDocumentsCounter, updateUnreadDocumentsCounter }}
    >
      {children}
    </BadgeContext.Provider>
  )
}
