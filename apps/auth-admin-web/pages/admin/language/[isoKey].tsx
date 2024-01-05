import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import { Language } from './../../../entities/models/language.model'
import { TranslationService } from './../../../services/TranslationService'
import LanguageCreateForm from '../../../components/Admin/form/LanguageCreateForm'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const isoKey = query.isoKey
  const [language, setLanguage] = useState<Language>()
  const router = useRouter()

  /** Load the api Scope and set the step from query if there is one */
  useEffect(() => {
    async function loadLanguage() {
      if (isoKey) {
        const decode = decodeURIComponent(isoKey as string)
        await getLanguage(decode)
      }
    }
    loadLanguage()
    document.title = LocalizationUtils.getPageTitle('admin.language.[isoKey]')
  }, [isoKey])

  const getLanguage = async (isoKey: string) => {
    const response = await TranslationService.findLanguage(isoKey)
    if (response) {
      setLanguage(response)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.Language}`)
  }

  const handleLanguageSaved = (languageSaved: Language) => {
    if (languageSaved) {
      router.push(`/admin/?tab=${AdminTab.Language}`)
    }
  }

  if (!language) {
    return (
      <ContentWrapper>
        <LoadingScreen />
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <LanguageCreateForm
        language={language}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleLanguageSaved}
      />
    </ContentWrapper>
  )
}
export default Index
