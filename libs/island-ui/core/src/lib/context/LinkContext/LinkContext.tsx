import React, { createContext } from 'react'

export interface LinkContextInterface {
  linkRenderer?: (href: string, children: React.ReactNode) => JSX.Element
}

export const LinkContext = createContext<LinkContextInterface>({
  linkRenderer: (href, children, ...props) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
})
