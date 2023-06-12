import ContentWrapper from './../../../components/Layout/ContentWrapper'
import React, { useEffect } from 'react'
import ApiResourceCreateForm from '../../../components/Resource/forms/ApiResourceCreateForm'
import { ApiResourcesDTO } from './../../../entities/dtos/api-resources-dto'
import { useRouter } from 'next/router'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'resource.api-resource.index',
    )
  }, [])

  const handleSave = (data: ApiResourcesDTO) => {
    router.push(
      `/resource/api-resource/${encodeURIComponent(data.name)}?step=2`,
    )
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiResourceCreateForm
        apiResource={new ApiResourcesDTO()}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </ContentWrapper>
  )
}
export default Index
