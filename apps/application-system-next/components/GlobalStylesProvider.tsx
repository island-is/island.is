'use client'

import { globalStyles } from '@island.is/island-ui/core'

globalStyles()

export const GlobalStylesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <>{children}</>
}
