import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminAccess } from '../../../entities/models/admin-access.model'
import AdminUserCreateForm from '../../../components/Admin/form/AdminUserCreateForm'
import { AdminAccessDTO } from './../../../entities/dtos/admin-acess.dto'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('admin.admin-user.index')
  }, [])

  const handleUserSaved = (admin: AdminAccess) => {
    if (admin && admin.nationalId) {
      router.push(`/admin/?tab=${AdminTab.AdminUsers}`)
    }
  }

  return (
    <ContentWrapper>
      <AdminUserCreateForm
        adminAccess={new AdminAccessDTO()}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleUserSaved}
      ></AdminUserCreateForm>
    </ContentWrapper>
  )
}
export default Index
