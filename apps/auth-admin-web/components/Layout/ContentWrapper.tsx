import React, { useEffect } from 'react'
import Header from './Header'
import Nav from './Nav'
import StatusBar from './StatusBar'
import { LOCALE_KEY } from './../../i18n/locales'
import ShowEnvironment from './ShowEnvironment'

const ContentWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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
