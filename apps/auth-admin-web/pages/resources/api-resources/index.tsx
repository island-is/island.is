import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React, { useEffect } from 'react'
import ApiResourcesList from '../../../components/Resource/lists/ApiResourcesList'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'resources.api-resources.index',
    )
  }, [])

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiResourcesList />
    </ContentWrapper>
  )
}
export default Index
