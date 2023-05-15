import { Outlet } from 'react-router-dom'
import { clientNav } from '../lib/navigation'
import React from 'react'
import Layout from '../components/Layout/Layout'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

const ClientsScreen = () => {
  const { formatMessage } = useLocale()
  return (
    <Layout navTitle={formatMessage(m.idsAdmin)} navItems={clientNav}>
      <Outlet />
    </Layout>
  )
}

export default ClientsScreen
