import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { Locale, useLocale } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import {
  useCreateUserProfile,
  useUpdateUserProfile,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import React, { useEffect, useState } from 'react'
import {
  LanguageForm,
  LanguageFormData,
  LanguageFormOption,
} from '../../components/Forms/LanguageForm'

export const EditLanguage: ServicePortalModuleComponent = ({ userInfo }) => {
  const [language, setLanguage] = useState<LanguageFormOption | null>(null)
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )
  const { formatMessage } = useLocale()
  const { createUserProfile } = useCreateUserProfile(userInfo.profile.natreg)
  const { updateUserProfile } = useUpdateUserProfile(userInfo.profile.natreg)

  useEffect(() => {
    if (!userProfile) return
    if (userProfile.locale.length > 0)
      setLanguage({
        value: userProfile.locale as Locale,
        label: userProfile.locale === 'is' ? 'Íslenska' : 'English',
      })
  }, [userProfile])

  const submitFormData = async (formData: LanguageFormData) => {
    if (formData.language === null) {
      setStatus('error')
      return
    }

    if (status !== 'passive') setStatus('passive')

    try {
      // Update the profile if it exists, otherwise create one
      if (userProfile) {
        await updateUserProfile({
          locale: formData.language.value,
        })
      } else {
        await createUserProfile({
          locale: formData.language.value,
        })
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  const handleSubmit = (data: LanguageFormData) => {
    submitFormData(data)
  }

  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h1">
          {formatMessage({
            id: 'sp.settings:edit-language',
            defaultMessage: 'Breyta tungumáli',
          })}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.settings:edit-language-description',
                defaultMessage: `
                  Hér getur þú gert breytingar á því tungumáli
                  sem þú vilt nota í kerfum island.is.
                `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <LanguageForm
        language={language}
        renderBackButton={() => (
          <Link to={ServicePortalPath.UserProfileRoot}>
            <Button variant="ghost">
              {formatMessage({
                id: 'service.portal:go-back',
                defaultMessage: 'Til baka',
              })}
            </Button>
          </Link>
        )}
        renderSubmitButton={() => (
          <Button type="submit" variant="primary" icon="arrowForward">
            {formatMessage({
              id: 'sp.settings:save-changes',
              defaultMessage: 'Vista breytingar',
            })}
          </Button>
        )}
        onSubmit={handleSubmit}
      />
      {status !== 'passive' && (
        <Box marginTop={[5, 7, 15]}>
          {status === 'success' && (
            <AlertMessage
              type="success"
              title="Nýtt tungumál hefur verið vistað"
              message="Þú hefur vistað nýtt tungumál hjá Stafrænt Ísland"
            />
          )}
          {status === 'error' && (
            <AlertMessage
              type="error"
              title="Tókst ekki að vista tungumál"
              message="Eitthvað hefur farið úrskeiðis, vinsamlegast reyndu aftur síðar"
            />
          )}
        </Box>
      )}
    </>
  )
}

export default EditLanguage
