import { Outlet, useOutletContext } from 'react-router-dom'
import { domainNav } from '../lib/navigation'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { IDSAdminPaths } from '../lib/paths'

const Tenant = () => {
  const [navTitle, setNavTitle] = useState('')
  const { setBackValue } = useOutletContext<{
    setBackValue: (value: string) => void
  }>()
  useEffect(() => {
    setBackValue(IDSAdminPaths.IDSAdmin)
  }, [])
  return (
    <Layout navTitle={navTitle} navItems={domainNav}>
      <Outlet context={{ setNavTitle }} />
    </Layout>
  )
}

export default Tenant
