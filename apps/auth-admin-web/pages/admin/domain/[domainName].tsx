import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { DomainDTO } from './../../../entities/dtos/domain.dto'
import { ResourcesService } from './../../../services/ResourcesService'
import DomainCreateForm from './../../../components/Admin/form/DomainCreateForm'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const domainName = query.domainName
  const router = useRouter()
  const [domain, setDomain] = useState<DomainDTO>()

  /** Load the user */
  useEffect(() => {
    async function loadDomain() {
      if (domainName) {
        const decoded = decodeURIComponent(domainName as string)
        await getDomain(decoded)
      }
    }
    loadDomain()
    document.title = LocalizationUtils.getPageTitle('admin.domain.[domainName]')
  }, [domainName])

  const getDomain = async (name: string) => {
    const response = await ResourcesService.getDomain(name)
    if (response) {
      const dto = response as DomainDTO
      setDomain(dto)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.Domains}`)
  }

  const handleUserSaved = () => {
    router.push(`/admin/?tab=${AdminTab.Domains}`)
  }

  if (!domain) {
    return (
      <ContentWrapper>
        <LoadingScreen />
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <DomainCreateForm
        domain={domain}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleUserSaved}
      />
    </ContentWrapper>
  )
}

export default Index
