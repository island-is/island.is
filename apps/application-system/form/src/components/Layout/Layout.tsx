import React, { FC } from 'react'

import { Header } from '../Header/Header'

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <>
    <Header />
    {children}
  </>
)
