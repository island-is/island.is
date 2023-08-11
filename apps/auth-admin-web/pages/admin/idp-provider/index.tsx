import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../../components/Layout/ContentWrapper'
import IdpProviderCreateForm from './../../../components/Admin/form/IdpProviderCreateForm'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'
import { IdpProviderDTO } from './../../../entities/dtos/idp-provider.dto'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('admin.idp-provider.index')
  }, [])

  const handleCancel = () => {
    router.back()
  }

  const handleIdpProviderSaved = (idpProviderSaved: IdpProvider) => {
    if (idpProviderSaved.name)
      router.push(`/admin/?tab=${AdminTab.IdpProviders}`)
  }

  return (
    <ContentWrapper>
      <IdpProviderCreateForm
        handleCancel={handleCancel}
        idpProvider={new IdpProviderDTO()}
        handleSaveButtonClicked={handleIdpProviderSaved}
      />
    </ContentWrapper>
  )
}
export default Index
