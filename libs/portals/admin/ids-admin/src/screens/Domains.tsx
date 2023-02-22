import { Outlet, useParams } from 'react-router-dom'
import { domainNav } from '../lib/navigation'
import React from 'react'
import MockData from '../lib/MockData'
import Layout from '../components/Layout/Layout'

const Domains = () => {
  const { tenant } = useParams()
  const findMockDataById = (id: string) => {
    return MockData.find((item) => item.id === id)
  }

  const domainData = findMockDataById(tenant as string)

  return (
    <Layout navTitle={domainData?.title ?? ''} navItems={domainNav}>
      <Outlet />
    </Layout>
  )
}

export default Domains
