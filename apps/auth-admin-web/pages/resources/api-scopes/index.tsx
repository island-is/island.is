import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ApiScopeList from '../../../components/Resource/lists/ApiScopeList'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React, { useEffect } from 'react'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'resources.api-scopes.index',
    )
  }, [])

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeList />
    </ContentWrapper>
  )
}
export default Index
