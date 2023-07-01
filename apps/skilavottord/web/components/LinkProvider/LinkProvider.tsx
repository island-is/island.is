import React, { FC, ReactNode } from 'react'
import { LinkContext } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

interface LinkProviderProps {
  children: ReactNode
}

export const LinkProvider: FC<React.PropsWithChildren<LinkProviderProps>> = ({
  children,
}) => {
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <a
            style={{
              color: theme.color.blue400,
            }}
            href={href}
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </LinkContext.Provider>
  )
}

export default LinkProvider
