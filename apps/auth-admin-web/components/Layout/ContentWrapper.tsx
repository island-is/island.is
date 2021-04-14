import React, { useEffect } from 'react'
import Header from './Header'
import Nav from './Nav'
import StatusBar from './StatusBar'
import { LOCALE_KEY } from './../../i18n/locales'

const ContentWrapper: React.FC = ({ children }) => {
  useEffect(() => {
    if (!localStorage.getItem(LOCALE_KEY)) {
      localStorage.setItem(LOCALE_KEY, 'en')
    }
  }, [])

  return (
    <div className="content-wrapper">
      <Header></Header>
      <Nav></Nav>
      <StatusBar></StatusBar>
      {children}
    </div>
  )
}
export default ContentWrapper
