import { Outlet } from 'react-router-dom'
import { idsAdminNav } from '../../lib/navigation'
import Layout from '../../components/Layout/Layout'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useState } from 'react'

const Tenant = () => {
  const { formatMessage } = useLocale()
  const [title, setTitle] = useState<string>(formatMessage(m.idsAdmin))
  return (
    <Layout
      navTitle={title ?? formatMessage(m.idsAdmin)}
      navItems={idsAdminNav}
    >
      <Outlet context={{ setTitle }} />
    </Layout>
  )
}

export default Tenant
