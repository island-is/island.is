import React from 'react'

import './index.scss'

import { Logo } from '@island.is/island-ui'

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
          Welcome to{' '}
          <Logo solid width={140} />
        </h1>
      </header>
    </div>
  )
}

export default Index
