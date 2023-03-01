import { Outlet, useParams } from 'react-router-dom'
import { applicationNav } from '../lib/navigation'
import React from 'react'
import MockApplications from '../lib/MockApplications'
import Layout from '../components/Layout/Layout'

const ApplicationsScreen = () => {
  const { application } = useParams()
  const findMockDataById = (id: string) => {
    return MockApplications.find((item) => item.id === id)
  }

  const applicationData = findMockDataById(application as string)

  return (
    <Layout navTitle={applicationData?.name ?? ''} navItems={applicationNav}>
      <Outlet />
    </Layout>
  )
}

export default ApplicationsScreen
