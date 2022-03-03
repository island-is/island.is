import React, { useEffect } from 'react'

import { LOCALE_KEY } from './../../i18n/locales'
import Header from './Header'
import Nav from './Nav'
import ShowEnvironment from './ShowEnvironment'
import StatusBar from './StatusBar'

const ContentWrapper: React.FC = ({ children }) => {
  useEffect(() => {
    if (!localStorage.getItem(LOCALE_KEY)) {
      localStorage.setItem(LOCALE_KEY, 'en')
    }
  }, [])

  return (
    <div className="content-wrapper">
      <ShowEnvironment></ShowEnvironment>
      <Header></Header>
      <Nav></Nav>
      <StatusBar></StatusBar>
      {children}
    </div>
  )
}
export default ContentWrapper
