import React from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import { Language } from './../../../entities/models/language.model'
import LanguageCreateForm from '../../../components/Admin/form/LanguageCreateForm'
import { LanguageDTO } from './../../../entities/dtos/language.dto'

const Index: React.FC = () => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  const handleIdpProviderSaved = (languageSaved: Language) => {
    if (languageSaved.isoKey) router.push(`/admin/?tab=${AdminTab.Language}`)
  }

  return (
    <ContentWrapper>
      <LanguageCreateForm
        handleCancel={handleCancel}
        language={new LanguageDTO()}
        handleSaveButtonClicked={handleIdpProviderSaved}
      />
    </ContentWrapper>
  )
}
export default Index
