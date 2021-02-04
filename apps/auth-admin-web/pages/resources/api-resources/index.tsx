import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React from 'react'
import ApiResourcesList from '../../../components/Resource/lists/ApiResourcesList'

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiResourcesList />
    </ContentWrapper>
  )
}
export default Index
