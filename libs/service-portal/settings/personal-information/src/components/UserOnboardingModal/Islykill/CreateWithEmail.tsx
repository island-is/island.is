import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useHistory } from 'react-router'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  Button,
  toast,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { gql, useMutation } from '@apollo/client'
import { EmailForm, EmailFormData } from '../../Forms/EmailForm'

const CreateIslykillSettings = gql`
  mutation createIslykillSettings($input: CreateIslykillSettingsInput!) {
    createIslykillSettings(input: $input) {
      nationalId
    }
  }
`

export const CreateUserWithEmail = () => {
  useNamespaces('sp.settings')
  const history = useHistory()
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )

  useEffect(() => {
    if (status === 'success') {
      history.go(0)
    }
  }, [status])

  const [createIslykill, { loading, error }] = useMutation(
    CreateIslykillSettings,
  )

  const { formatMessage } = useLocale()
  const submitFormData = async (formData: EmailFormData) => {
    if (status !== 'passive') setStatus('passive')

    try {
      await createIslykill({
        variables: { input: { email: formData.email } },
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
      <Box marginBottom={2} marginTop={3}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.settings:create-email-description',
                defaultMessage: `
                Ekkert netfang er vistað fyrir þennan notanda.
                Hér getur þú bætt við netfangi
              `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <EmailForm
        email=""
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
    </>
  )
}

export default CreateUserWithEmail
