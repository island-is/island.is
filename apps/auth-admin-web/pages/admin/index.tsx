import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import { NextPageContext } from 'next'
import { withAuthentication } from './../../utils/auth.utils'
import AdminTabNav from './../../components/Admin/nav/AdminTabNav'
import { AdminTab } from './../../entities/common/AdminTab'
import AdminUsersList from './../../components/Admin/lists/AdminUsersList'
import IdpProvidersList from './../../components/Admin/lists/IdpProviderList'

const Index: React.FC = () => {
  const { query } = useRouter()
  const tabQuery = query.tab
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.AdminUsers)

  useEffect(() => {
    setActiveTab(+tabQuery)
  }, [tabQuery])

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab)
  }

  switch (activeTab) {
    case AdminTab.AdminUsers: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <AdminUsersList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    case AdminTab.IdpProviders: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <IdpProvidersList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    case AdminTab.IPNumbersControl: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <div className="temp-page">Not yet implemented</div>
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    case AdminTab.Logs: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <div className="temp-page">
              To view IDS related logs in Datadog click{' '}
              <a
                href="https://app.datadoghq.eu/logs?cols=core_host%2Ccore_service&from_ts=1603725071881&index=&live=true&messageDisplay=expanded-md&query=kube_namespace%3Aidentity-server&stream_sort=desc&to_ts=1603725971881"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </div>
            <div className="temp-page">
              To view IDS dashboard in Datadog click{' '}
              <a
                href="https://app.datadoghq.eu/dashboard/i9j-xs6-zbu/identity-server?from_ts=1611271075147&live=true&to_ts=1611875875147"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </div>
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    default: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <AdminUsersList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
  }
}
export default Index

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)
