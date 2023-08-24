import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import DomainCreateForm from './../../../components/Admin/form/DomainCreateForm'
import { DomainDTO } from './../../../entities/dtos/domain.dto'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('admin.domain.index')
  }, [])

  const handleDomainSaved = () => {
    router.push(`/admin/?tab=${AdminTab.Domains}`)
  }

  return (
    <ContentWrapper>
      <DomainCreateForm
        domain={new DomainDTO()}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleDomainSaved}
      />
    </ContentWrapper>
  )
}
export default Index
