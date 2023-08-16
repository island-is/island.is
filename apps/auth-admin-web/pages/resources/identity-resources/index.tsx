import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React, { useEffect } from 'react'
import IdentityResourcesList from '../../../components/Resource/lists/IdentityResourcesList'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'resources.identity-resources.index',
    )
  }, [])

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <IdentityResourcesList />
    </ContentWrapper>
  )
}
export default Index
