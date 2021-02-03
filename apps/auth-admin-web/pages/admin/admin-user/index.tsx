import React from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { NextPageContext } from 'next'
import { withAuthentication } from '../../../utils/auth.utils'
import { AdminAccess } from '../../../entities/models/admin-access.model'
import AdminUserCreateForm from '../../../components/Admin/form/AdminUserCreateForm'
import { AdminAccessDTO } from './../../../entities/dtos/admin-acess.dto'

const Index: React.FC = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  const handleUserSaved = (admin: AdminAccess) => {
    if (admin && admin.nationalId) {
      router.push(`/admin/?tab=1`)
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

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)
