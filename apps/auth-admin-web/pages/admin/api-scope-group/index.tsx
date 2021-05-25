import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ApiScopeUserCreateForm from '../../../components/Admin/form/ApiScopeUserCreateForm'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { ApiScopeUser } from './../../../entities/models/api-scope-user.model'
import ApiScopeGroupCreateForm from './../../../components/Resource/forms/ApiScopeGroupCreateForm'
import { ApiScopeGroup } from './../../../entities/models/api-scope-group.model'

const Index: React.FC = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle(
      'admin.api-scope-user.index',
    )
  }, [])

  const handleGroupSaved = () => {
    router.push(`/admin/?tab=${AdminTab.ApiScopeGroups}`)
  }

  return (
    <ContentWrapper>
      <ApiScopeGroupCreateForm
        apiScopeGroup={new ApiScopeGroup()}
        isModal={false}
        handleNext={handleGroupSaved}
        handleBack={router.back}
      ></ApiScopeGroupCreateForm>
    </ContentWrapper>
  )
}
export default Index
