import { Outlet } from 'react-router-dom'
import { domainNav } from '../lib/navigation'
import React from 'react'
import Layout from '../components/Layout/Layout'

const Tenant = () => {
  const [navTitle, setNavTitle] = React.useState('')
  return (
    <Layout navTitle={navTitle} navItems={domainNav}>
      <Outlet context={{ setNavTitle }} />
    </Layout>
  )
}

export default Tenant
