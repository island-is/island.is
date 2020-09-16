import React from 'react'
import { Header } from './Header'

export default {
  title: 'Navigation/Header',
  component: Header,
}

export const Default = () => (
  <Header authenticated language="EN" logoutText="Logout" />
)
