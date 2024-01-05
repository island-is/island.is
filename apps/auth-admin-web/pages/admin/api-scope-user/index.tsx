import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ApiScopeUserCreateForm from '../../../components/Admin/form/ApiScopeUserCreateForm'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { ApiScopeUserDTO } from './../../../entities/dtos/api-scope-user.dto'
import { ApiScopeUser } from './../../../entities/models/api-scope-user.model'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'admin.api-scope-user.index',
    )
  }, [])

  const handleUserSaved = (apiScopeUser: ApiScopeUser) => {
    if (apiScopeUser && apiScopeUser.nationalId) {
      router.push(`/admin/?tab=${AdminTab.ApiScopeUsers}`)
    }
  }

  return (
    <ContentWrapper>
      <ApiScopeUserCreateForm
        apiScopeUser={new ApiScopeUserDTO()}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleUserSaved}
      />
    </ContentWrapper>
  )
}
export default Index
