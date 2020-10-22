import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
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
import { EmailForm, EmailFormData } from '../../components/Forms/EmailForm'

export const EditEmail: ServicePortalModuleComponent = ({ userInfo }) => {
  const [email, setEmail] = useState('')
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )
  const { formatMessage } = useLocale()
  const { createUserProfile } = useCreateUserProfile(userInfo.profile.natreg)
  const { updateUserProfile } = useUpdateUserProfile(userInfo.profile.natreg)

  useEffect(() => {
    if (!userProfile) return
    if (userProfile.email.length > 0) setEmail(userProfile.email)
  }, [userProfile])

  const submitFormData = async (formData: EmailFormData) => {
    if (status !== 'passive') setStatus('passive')

    try {
      // Update the profile if it exists, otherwise create one
      if (userProfile) {
        await updateUserProfile({
          email: formData.email,
        })
      } else {
        await createUserProfile({
          email: formData.email,
        })
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  const handleSubmit = (data: EmailFormData) => {
    submitFormData(data)
  }

  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h1">
          {formatMessage({
            id: 'sp.settings:edit-email',
            defaultMessage: 'Breyta netfangi',
          })}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.settings:edit-email-description',
                defaultMessage: `
					Hér getur þú gert breytingar á þínu netfangi.
					Ath. netfangið er notað til þess að senda þér
					upplýsingar og ná í þig ef þörf krefur.
				  `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <EmailForm
        email={email}
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
              title="Nýtt netfang hefur verið vistað"
              message="Þú hefur vistað nýtt netfang hjá Stafrænt Ísland"
            />
          )}
          {status === 'error' && (
            <AlertMessage
              type="error"
              title="Tókst ekki að vista netfang"
              message="Eitthvað hefur farið úrskeiðis, vinsamlegast reyndu aftur síðar"
            />
          )}
        </Box>
      )}
    </>
  )
}

export default EditEmail
