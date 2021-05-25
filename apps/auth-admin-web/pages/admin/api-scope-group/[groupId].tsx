import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { ApiScopeUserDTO as ApiScopeGroup } from './../../../entities/dtos/api-scope-user.dto'
import { ResourcesService } from './../../../services/ResourcesService'
import ApiScopeGroupCreateForm from './../../../components/Resource/forms/ApiScopeGroupCreateForm'

const Index: React.FC = () => {
  const { query } = useRouter()
  const groupId = query.groupId
  const router = useRouter()
  const [apiScopeGroup, setApiScopeGroup] = useState<ApiScopeGroup>(
    new ApiScopeGroup(),
  )

  /** Load the user */
  useEffect(() => {
    async function loadUser() {
      if (groupId) {
        const decoded = decodeURIComponent(groupId as string)
        await getGroup(decoded)
      }
    }
    loadUser()
    document.title = LocalizationUtils.getPageTitle(
      'admin.api-scope-user.[apiScopeUser]',
    )
  }, [groupId])

  const getGroup = async (groupId: string) => {
    const response = await ResourcesService.findApiScopeGroup(groupId)
    if (response) {
      setApiScopeGroup(response)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.ApiScopeGroups}`)
  }

  const handleGroupSaved = (userSaved: ApiScopeGroup) => {
    if (userSaved) {
      router.push(`/admin/?tab=${AdminTab.ApiScopeGroups}`)
    }
  }

  return (
    <ContentWrapper>
      <ApiScopeGroupCreateForm
        apiScopeGroup={apiScopeGroup}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleGroupSaved}
      ></ApiScopeGroupCreateForm>
    </ContentWrapper>
  )
}

export default Index
