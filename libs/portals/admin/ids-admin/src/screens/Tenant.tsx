import { Outlet } from 'react-router-dom'
import { domainNav } from '../lib/navigation'
import { useState } from 'react'
import Layout from '../components/Layout/Layout'

const Tenant = () => {
  const [navTitle, setNavTitle] = useState('')
  return (
    <Layout navTitle={navTitle} navItems={domainNav}>
      <Outlet context={{ setNavTitle }} />
    </Layout>
  )
}

export default Tenant
