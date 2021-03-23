import React from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import TranslationCreateForm from '../../../components/Admin/form/TranslationCreateForm'
import { TranslationDTO } from './../../../entities/dtos/translation.dto'
import { Translation } from './../../../entities/models/translation.model'

const Index: React.FC = () => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  const handleTranslationSaved = (translationSaved: Translation) => {
    if (translationSaved.language)
      router.push(`/admin/?tab=${AdminTab.Translation}`)
  }

  return (
    <ContentWrapper>
      <TranslationCreateForm
        handleCancel={handleCancel}
        translation={new TranslationDTO()}
        handleSaveButtonClicked={handleTranslationSaved}
      />
    </ContentWrapper>
  )
}
export default Index
