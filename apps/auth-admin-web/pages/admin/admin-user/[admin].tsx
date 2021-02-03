import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from '../../../utils/auth.utils'
import { AdminAccessService } from '../../../services/AdminAccessService'
import { AdminAccessDTO } from '../../../entities/dtos/admin-acess.dto'
import { AdminAccess } from '../../../entities/models/admin-access.model'
import AdminUserCreateForm from '../../../components/Admin/form/AdminUserCreateForm'

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
  }, [nationalId])

  const getUser = async (nationalId: string) => {
    const response = await AdminAccessService.findOne(nationalId)
    if (response) {
      const dto = response as AdminAccessDTO
      setAdminUser(dto)
    }
  }

  const handleCancel = () => {
    router.push('/admin/?tab=1')
  }

  const handleUserSaved = (userSaved: AdminAccess) => {
    if (userSaved) {
      router.push('/admin/?tab=1')
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

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)

export default Index
