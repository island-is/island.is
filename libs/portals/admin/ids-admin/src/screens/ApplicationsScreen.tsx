import { Outlet } from 'react-router-dom'
import React from 'react'

import { useLocale } from '@island.is/localization'

import { idsAdminNav } from '../lib/navigation'
import Layout from '../components/Layout/Layout'
import { m } from '../lib/messages'

const ApplicationsScreen = () => {
  const { formatMessage } = useLocale()
  return (
    <Layout navTitle={formatMessage(m.idsAdmin)} navItems={idsAdminNav}>
      <Outlet />
    </Layout>
  )
}

export default ApplicationsScreen
