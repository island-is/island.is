import { FC, useEffect, useState } from 'react'
import { GlobalStyles } from '@contentful/f36-components'
import { SDKProvider } from '@contentful/react-apps-toolkit'

import LocalhostWarning from './LocalhostWarning'

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  if (process.env.NODE_ENV === 'development' && window.self === window.top)
    return <LocalhostWarning />

  return (
    <SDKProvider>
      <GlobalStyles />
      {children}
    </SDKProvider>
  )
}
