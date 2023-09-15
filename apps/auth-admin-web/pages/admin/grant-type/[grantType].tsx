import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { GrantTypeService } from './../../../services/GrantTypeService'
import { GrantType } from './../../../entities/models/grant-type.model'
import { AdminTab } from './../../../entities/common/AdminTab'
import GrantTypeCreateForm from './../../../components/Admin/form/GrantTypeCreateForm'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const grantTypeName = query.grantType
  const [grantType, setGrantType] = useState<GrantType>()
  const router = useRouter()

  useEffect(() => {
    async function loadIdp() {
      if (grantTypeName) {
        const decode = decodeURIComponent(grantTypeName as string)
        await getGrantType(decode)
      }
    }
    loadIdp()
    document.title = LocalizationUtils.getPageTitle(
      'admin.grant-type.[grantType]',
    )
  }, [grantTypeName])

  const getGrantType = async (grantTypeName: string) => {
    const response = await GrantTypeService.findByName(grantTypeName)
    if (response) {
      setGrantType(response)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.GrantTypes}`)
  }

  const handleGrantTypeSaved = (grantTypeSaved: GrantType) => {
    if (grantTypeSaved) {
      router.push(`/admin/?tab=${AdminTab.GrantTypes}`)
    }
  }

  if (!grantType) {
    return (
      <ContentWrapper>
        <LoadingScreen />
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <GrantTypeCreateForm
        grantType={grantType}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleGrantTypeSaved}
      />
    </ContentWrapper>
  )
}
export default Index
