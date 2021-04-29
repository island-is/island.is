import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminAccess } from '../../../entities/models/admin-access.model'
import AdminUserCreateForm from '../../../components/Admin/form/AdminUserCreateForm'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { ApiScopeUserDTO } from './../../../entities/dtos/api-scope-user.dto'
import { ApiScopeUser } from './../../../entities/models/api-scope-user.model'

const Index: React.FC = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('admin.admin-user.index')
  }, [])

  const handleUserSaved = (apiScopeUser: ApiScopeUser) => {
    if (apiScopeUser && apiScopeUser.nationalId) {
      router.push(`/admin/?tab=${AdminTab.AdminUsers}`)
    }
  }

  return (
    <ContentWrapper>
      <AdminUserCreateForm
        apiScopeUser={new ApiScopeUserDTO()}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleUserSaved}
      ></AdminUserCreateForm>
    </ContentWrapper>
  )
}
export default Index
