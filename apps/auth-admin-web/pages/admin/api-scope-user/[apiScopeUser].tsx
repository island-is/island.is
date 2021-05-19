import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AccessService } from '../../../services/AccessService'
import ApiScopeUserCreateForm from '../../../components/Admin/form/ApiScopeUserCreateForm'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { ApiScopeUserDTO } from './../../../entities/dtos/api-scope-user.dto'
import { ApiScopeUser } from './../../../entities/models/api-scope-user.model'

const Index: React.FC = () => {
  const { query } = useRouter()
  const nationalId = query.apiScopeUser
  const router = useRouter()
  const [apiScopeUser, setApiScopeUser] = useState<ApiScopeUserDTO>(
    new ApiScopeUserDTO(),
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
    document.title = LocalizationUtils.getPageTitle(
      'admin.api-scope-user.[apiScopeUser]',
    )
  }, [nationalId])

  const getUser = async (nationalId: string) => {
    const response = await AccessService.findOne(nationalId)
    if (response) {
      const dto = response as ApiScopeUserDTO
      setApiScopeUser(dto)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.ApiScopeUsers}`)
  }

  const handleUserSaved = (userSaved: ApiScopeUser) => {
    if (userSaved) {
      router.push(`/admin/?tab=${AdminTab.ApiScopeUsers}`)
    }
  }

  return (
    <ContentWrapper>
      <ApiScopeUserCreateForm
        apiScopeUser={apiScopeUser}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleUserSaved}
      ></ApiScopeUserCreateForm>
    </ContentWrapper>
  )
}

export default Index
