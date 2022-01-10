import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import {
  useUserProfile,
  useUpdateUserProfile,
  useCreateUserProfile,
} from '@island.is/service-portal/graphql'
import { Link, Redirect } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { useState } from 'react'
import { NudgeForm, NudgeFormData } from '../../components/Forms/NudgeForm'

export const EditNudge: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')
  const { data: settings } = useUserProfile()
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )
  const { createUserProfile } = useCreateUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { formatMessage } = useLocale()

  const submitFormData = async (formData: NudgeFormData) => {
    if (status !== 'passive') setStatus('passive')

    try {
      if (settings) {
        await updateUserProfile({
          canNudge: formData.nudge,
        })
      } else {
        await createUserProfile({
          canNudge: formData.nudge,
        })
      }
      setStatus('success')
      toast.success(
        formatMessage({
          id: 'sp.settings:nudge-confirmed-saved',
          defaultMessage: 'Hnipp stillingar vistaðar',
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
            id: 'sp.settings:edit-nudge',
            defaultMessage: 'Breyta hnippi',
          })}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.settings:edit-nudge-description',
                defaultMessage: `
                    Hér getur þú gert breytingar á hnipp möguleikum. 
                    Hnipp stillingar segja til um hvort þú viljir að Island.is láti 
                    þig vita þegar eitthvað markvert gerist.
                  `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      {settings && (
        <NudgeForm
          nudge={!!settings?.canNudge}
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
      )}
      {status !== 'passive' && (
        <Box marginTop={[5, 7, 15]}>
          {status === 'error' && (
            <AlertMessage
              type="error"
              title={formatMessage({
                id: 'sp.settings:nudge-confirmed-sent-error-title',
                defaultMessage: 'Tókst ekki að vista hnipp stillingar',
              })}
              message={formatMessage({
                id: 'sp.settings:nudge-confirmed-sent-error-subtext',
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

export default EditNudge
