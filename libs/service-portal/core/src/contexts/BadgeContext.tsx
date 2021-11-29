import React, { createContext, useState } from 'react'
import { useUnreadDocumentsCounter } from '@island.is/service-portal/graphql'

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
  const counter = useUnreadDocumentsCounter()
  const [unreadDocumentsCounter, setUnreadDocCounter] = useState<number>(
    counter,
  )

  function updateUnreadDocumentsCounter() {
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
