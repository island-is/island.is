import ContentWrapper from './../../../components/Layout/ContentWrapper'
import React, { useEffect } from 'react'
import ApiScopeCreateForm from '../../../components/Resource/forms/ApiScopeCreateForm'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { useRouter } from 'next/router'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('resource.api-scope.index')
  }, [])

  const handleSave = (data: ApiScopeDTO) => {
    router.push(`/resource/api-scope/${encodeURIComponent(data.name)}?step=2`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeCreateForm
        handleSave={handleSave}
        handleCancel={handleCancel}
        apiScope={new ApiScopeDTO()}
      />
    </ContentWrapper>
  )
}
export default Index
