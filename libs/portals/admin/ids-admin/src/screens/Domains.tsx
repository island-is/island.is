import { Outlet } from 'react-router-dom'
import { domainNav } from '../lib/navigation'
import React from 'react'
import Layout from '../components/Layout/Layout'

const Domains = () => {
  return (
    <Layout navTitle={''} navItems={domainNav}>
      <Outlet />
    </Layout>
  )
}

export default Domains
