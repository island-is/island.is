import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ApiScopeList from '../../../components/Resource/lists/ApiScopeList'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React from 'react'

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeList />
    </ContentWrapper>
  )
}
export default Index
