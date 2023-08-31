import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import ApiScopeGroupCreateForm from './../../../components/Resource/forms/ApiScopeGroupCreateForm'
import { ApiScopeGroup } from './../../../entities/models/api-scope-group.model'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const initialApiScopeGroup = useMemo(() => {
    const scopeGroup = new ApiScopeGroup()
    scopeGroup.order = 0
    return scopeGroup
  }, [])
  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.ApiScopeGroups}`)
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'admin.api-scope-group.index',
    )
  }, [])

  const handleGroupSaved = () => {
    router.push(`/admin/?tab=${AdminTab.ApiScopeGroups}`)
  }

  return (
    <ContentWrapper>
      <ApiScopeGroupCreateForm
        apiScopeGroup={initialApiScopeGroup}
        handleNext={handleGroupSaved}
        handleBack={handleCancel}
      ></ApiScopeGroupCreateForm>
    </ContentWrapper>
  )
}
export default Index
