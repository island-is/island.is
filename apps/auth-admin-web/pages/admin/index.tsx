import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import AdminTabNav from './../../components/Admin/nav/AdminTabNav'
import { AdminTab } from './../../entities/common/AdminTab'
import ApiScopeUsersList from '../../components/Admin/lists/ApiScopeUsersList'
import IdpProvidersList from '../../components/Admin/lists/IdpProvidersList'
import GrantTypesList from './../../components/Admin/lists/GrantTypesList'
import LanguageList from './../../components/Admin/lists/LanguageList'
import TranslationList from './../../components/Admin/lists/TranslationList'
import LocalizationUtils from '../../utils/localization.utils'
import { RoleUtils } from './../../utils/role.utils'
import UsersList from './../../components/Admin/lists/UsersList'
import ApiScopeGroupList from './../../components/Resource/lists/ApiScopeGroupList'
import DomainList from './../../components/Admin/lists/DomainList'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const { query } = useRouter()
  const tabQuery = query.tab
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.ApiScopeUsers)

  useEffect(() => {
    async function resolveRoles() {
      const isAdmin = await RoleUtils.isUserAdmin()
      if (!isAdmin) {
        router.push('/')
      }
    }
    resolveRoles()
    setActiveTab(+tabQuery)
    document.title = LocalizationUtils.getPageTitle('admin.index')
  }, [tabQuery])

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab)
  }

  switch (activeTab) {
    case AdminTab.Users: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <UsersList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    case AdminTab.ApiScopeUsers: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <ApiScopeUsersList />
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
    case AdminTab.GrantTypes: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <GrantTypesList />
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
    case AdminTab.Language: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <LanguageList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    case AdminTab.Translation: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <TranslationList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    case AdminTab.ApiScopeGroups: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <ApiScopeGroupList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }

    case AdminTab.Domains: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <DomainList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
    default: {
      return (
        <ContentWrapper>
          <AdminTabNav handleTabChange={handleTabChange} activeTab={activeTab}>
            <ApiScopeUsersList />
          </AdminTabNav>
        </ContentWrapper>
      )
    }
  }
}
export default Index
