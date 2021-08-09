import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import {
  useCreateUserProfile,
  useResendEmailVerification,
  useUpdateUserProfile,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import React, { useEffect, useState } from 'react'
import { EmailForm, EmailFormData } from '../../components/Forms/EmailForm'

export const EditEmail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const [email, setEmail] = useState('')
  const { data: userProfile } = useUserProfile()
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )
  const { formatMessage } = useLocale()
  const { createUserProfile } = useCreateUserProfile()
  const { resendEmailVerification } = useResendEmailVerification()
  const { updateUserProfile } = useUpdateUserProfile()
  const history = useHistory()

  useEffect(() => {
    if (!userProfile || !userProfile.email) return
    if (userProfile.email.length > 0) setEmail(userProfile.email)
  }, [userProfile])

  const handleResendEmail = async () => {
    if (userProfile && userProfile.email) {
      try {
        await resendEmailVerification()
        toast.info(
          formatMessage({
            id: 'sp.settings:email-confirmation-resent',
            defaultMessage: 'Þú hefur fengið sendan nýjan staðfestingarpóst',
          }),
        )
        history.push(ServicePortalPath.SettingsPersonalInformation)
      } catch (err) {
        toast.error(
          formatMessage({
            id: 'sp.settings:email-confirmation-resend-error',
            defaultMessage:
              'Ekki tókst að senda nýjan staðfestingarpóst, eitthvað fór úrskeiðis',
          }),
        )
      }
    }
  }

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
      toast.success(
        formatMessage({
          id: 'sp.settings:email-confirmed-sent-success-subtext',
          defaultMessage:
            'Vinsamlegast athugaðu netpóstinn þinn, staðfestingarpóstur hefur verið sendur á þig',
        }),
      )
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
        <Text variant="h1" as="h1">
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
        onResendEmail={handleResendEmail}
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
        onSubmit={handleSubmit}
      />
      {status !== 'passive' && (
        <Box marginTop={[5, 7, 15]}>
          {status === 'error' && (
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
