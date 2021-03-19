import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'

import { TranslationService } from './../../../services/TranslationService'
import LanguageCreateForm from '../../../components/Admin/form/LanguageCreateForm'
import { Translation } from './../../../entities/models/translation.model'
import TranslationCreateForm from 'apps/auth-admin-web/components/Admin/form/TranslationCreateForm'
import { TranslationDTO } from 'apps/auth-admin-web/entities/dtos/translation.dto'

const Index: React.FC = () => {
  const { query } = useRouter()
  const key = query.key
  const [translation, setTranslation] = useState<Translation>(new Translation())
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
