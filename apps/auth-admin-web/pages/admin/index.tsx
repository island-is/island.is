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
              To view logs on Datadog click{' '}
              <a
                href="https://app.datadoghq.eu/"
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
