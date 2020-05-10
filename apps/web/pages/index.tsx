import React from 'react'
import { Logo } from '@island.is/island-ui/core'

import './index.scss'

export const Index = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./${fileName}.${style} file.
   */
  return (
    <div className="app">
      <header className="flex">
        <h1>
          Welcome to <Logo solid width={140} />
        </h1>
      </header>
    </div>
  )
}

export default Index
