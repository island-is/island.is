import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React from 'react'
import IdentityResourcesList from '../../../components/Resource/lists/IdentityResourcesList'

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <IdentityResourcesList />
    </ContentWrapper>
  )
}
export default Index
