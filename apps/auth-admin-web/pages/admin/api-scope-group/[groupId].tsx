import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { ResourcesService } from './../../../services/ResourcesService'
import ApiScopeGroupCreateForm from './../../../components/Resource/forms/ApiScopeGroupCreateForm'
import { ApiScopeGroup } from './../../../entities/models/api-scope-group.model'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const groupId = query.groupId
  const router = useRouter()
  const [apiScopeGroup, setApiScopeGroup] = useState<ApiScopeGroup>()

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
      'admin.api-scope-group.[groupId]',
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

  const handleGroupSaved = () => {
    router.push(`/admin/?tab=${AdminTab.ApiScopeGroups}`)
  }

  if (!apiScopeGroup) {
    return (
      <ContentWrapper>
        <LoadingScreen />
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <ApiScopeGroupCreateForm
        apiScopeGroup={apiScopeGroup}
        handleBack={handleCancel}
        handleNext={handleGroupSaved}
      ></ApiScopeGroupCreateForm>
    </ContentWrapper>
  )
}

export default Index
