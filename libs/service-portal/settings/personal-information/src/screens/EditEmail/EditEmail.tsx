import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { gql, useMutation } from '@apollo/client'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { Link, Redirect } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { useState, useEffect } from 'react'
import { EmailForm, EmailFormData } from '../../components/Forms/EmailForm'

const UpdateIslykillSettings = gql`
  mutation updateIslykillSettings($input: UpdateIslykillSettingsInput!) {
    updateIslykillSettings(input: $input) {
      nationalId
    }
  }
`

export const EditEmail: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')
  const [email, setEmail] = useState('')
  const { data: settings } = useUserProfile()
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )

  const [updateIslykill, { loading, error }] = useMutation(
    UpdateIslykillSettings,
  )
  const { formatMessage } = useLocale()

  useEffect(() => {
    if (settings?.email) setEmail(settings.email)
  }, [settings])

  const submitFormData = async (formData: EmailFormData) => {
    if (status !== 'passive') setStatus('passive')

    try {
      // Update the profile if it exists, otherwise create one
      await updateIslykill({
        variables: {
          input: { email: formData.email, mobile: settings?.mobilePhoneNumber },
        },
      })
      setStatus('success')
      toast.success(
        formatMessage({
          id: 'sp.settings:email-confirmed-saved',
          defaultMessage: 'Tölvupóstfang vistað',
        }),
      )
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h3" as="h1">
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
          <Link to={ServicePortalPath.SettingsPersonalInformation}>
            <Button variant="ghost">{formatMessage(m.goBack)}</Button>
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
        onSubmit={submitFormData}
      />
      {status !== 'passive' && !loading && (
        <Box marginTop={[5, 7, 15]}>
          {(status === 'error' || error) && (
            <AlertMessage
              type="error"
              title={formatMessage({
                id: 'sp.settings:email-confirmed-sent-error-title',
                defaultMessage: 'Tókst ekki að vista netfang',
              })}
              message={formatMessage({
                id: 'sp.settings:email-confirmed-sent-error-subtext',
                defaultMessage:
                  'Eitthvað hefur farið úrskeiðis, vinsamlegast reynið aftur síðar',
              })}
            />
          )}
        </Box>
      )}
      {status === 'success' && (
        <Redirect to={ServicePortalPath.SettingsPersonalInformation} />
      )}
    </>
  )
}

export default EditEmail
