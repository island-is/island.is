import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminAccessService } from '../../../services/AdminAccessService'
import { AdminAccessDTO } from '../../../entities/dtos/admin-acess.dto'
import { AdminAccess } from '../../../entities/models/admin-access.model'
import AdminUserCreateForm from '../../../components/Admin/form/AdminUserCreateForm'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC = () => {
  const { query } = useRouter()
  const nationalId = query.admin
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<AdminAccessDTO>(
    new AdminAccessDTO(),
  )

  /** Load the user */
  useEffect(() => {
    async function loadUser() {
      if (nationalId) {
        const decoded = decodeURIComponent(nationalId as string)
        await getUser(decoded)
      }
    }
    loadUser()
    document.title = LocalizationUtils.getPageTitle('admin.admin-user.[admin]')
  }, [nationalId])

  const getUser = async (nationalId: string) => {
    const response = await AdminAccessService.findOne(nationalId)
    if (response) {
      const dto = response as AdminAccessDTO
      setAdminUser(dto)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.AdminUsers}`)
  }

  const handleUserSaved = (userSaved: AdminAccess) => {
    if (userSaved) {
      router.push(`/admin/?tab=${AdminTab.AdminUsers}`)
    }
  }

  return (
    <ContentWrapper>
      <AdminUserCreateForm
        adminAccess={adminUser}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleUserSaved}
      ></AdminUserCreateForm>
    </ContentWrapper>
  )
}

export default Index
