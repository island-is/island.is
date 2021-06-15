import React, { FC } from 'react'

import { Header } from '../Header/Header'

export const Layout: FC = ({ children }) => (
  <>
    <Header />
    {children}
  </>
)
