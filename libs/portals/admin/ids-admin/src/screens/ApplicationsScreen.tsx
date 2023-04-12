import { Outlet } from 'react-router-dom'
import { applicationNav } from '../lib/navigation'
import React from 'react'
import Layout from '../components/Layout/Layout'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

const ApplicationsScreen = () => {
  const { formatMessage } = useLocale()
  return (
    <Layout navTitle={formatMessage(m.idsAdmin)} navItems={applicationNav}>
      <Outlet />
    </Layout>
  )
}

export default ApplicationsScreen
