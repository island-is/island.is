import React from 'react'
import Header from './Header'
import Nav from './Nav'
import StatusBar from './StatusBar'

const ContentWrapper: React.FC = ({ children }) => {
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
