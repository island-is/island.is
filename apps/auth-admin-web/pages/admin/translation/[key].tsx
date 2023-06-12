import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import { TranslationService } from './../../../services/TranslationService'
import { Translation } from './../../../entities/models/translation.model'
import TranslationCreateForm from './../../../components/Admin/form/TranslationCreateForm'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const key = query.key
  const [translation, setTranslation] = useState<Translation>()
  const router = useRouter()

  /** Load the api Scope and set the step from query if there is one */
  useEffect(() => {
    async function loadLanguage() {
      if (key) {
        const decode = decodeURIComponent(key as string)
        const keys = decode.split('$')
        await getTranslation(keys[0], keys[1], keys[2], keys[3])
      }
    }
    loadLanguage()
    document.title = LocalizationUtils.getPageTitle('admin.translation.[key]')
  }, [key])

  const getTranslation = async (
    language: string,
    className: string,
    property: string,
    key: string,
  ) => {
    const response = await TranslationService.findTranslation(
      language,
      className,
      property,
      key,
    )
    if (response) {
      setTranslation(response)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/?tab=${AdminTab.Translation}`)
  }

  const handleTranslationSaved = (translationSaved: Translation) => {
    if (translationSaved) {
      router.push(`/admin/?tab=${AdminTab.Translation}`)
    }
  }

  if (!translation) {
    return (
      <ContentWrapper>
        <LoadingScreen />
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <TranslationCreateForm
        handleCancel={handleCancel}
        translation={translation}
        handleSaveButtonClicked={handleTranslationSaved}
      />
    </ContentWrapper>
  )
}
export default Index
