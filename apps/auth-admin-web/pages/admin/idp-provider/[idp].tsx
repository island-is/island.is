import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { IdpProvider } from '../../../entities/models/IdpProvider.model'
import { IdpProviderService } from './../../../services/IdpProviderService'
import IdpProviderCreateForm from './../../../components/Admin/form/IdpProviderCreateForm'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC = () => {
  const { query } = useRouter()
  const idpProviderName = query.idp
  const [idpProvider, setIdpProvider] = useState<IdpProvider>(new IdpProvider())
  const router = useRouter()

  /** Load the api Scope and set the step from query if there is one */
  useEffect(() => {
    async function loadIdp() {
      if (idpProviderName) {
        const decode = decodeURIComponent(idpProviderName as string)
        await getIdpProvider(decode)
      }
    }
    loadIdp()
    document.title = LocalizationUtils.getPageTitle('admin.idp-provider.[idp]')
  }, [idpProviderName])

  const getIdpProvider = async (idpName: string) => {
    const response = await IdpProviderService.findByName(idpName)
    if (response) {
      setIdpProvider(response)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.IdpProviders}`)
  }

  const handleIdpSaved = (idpSaved: IdpProvider) => {
    if (idpSaved) {
      router.push(`/admin/?tab=${AdminTab.IdpProviders}`)
    }
  }

  return (
    <ContentWrapper>
      <IdpProviderCreateForm
        idpProvider={idpProvider}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleIdpSaved}
      />
    </ContentWrapper>
  )
}
export default Index
