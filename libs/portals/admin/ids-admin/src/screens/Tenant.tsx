import { Dispatch, SetStateAction, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { domainNav } from '../lib/navigation'
import Layout from '../components/Layout/Layout'

const Tenant = () => {
  const [navTitle, setNavTitle] = useState('')

  return (
    <Layout navTitle={navTitle} navItems={domainNav}>
      <Outlet context={{ setNavTitle }} />
    </Layout>
  )
}

type TenantOutletContext = {
  setNavTitle: Dispatch<SetStateAction<string>>
}

export function useTenant() {
  return useOutletContext<TenantOutletContext>()
}

export default Tenant
