import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { Link, Redirect } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import {
  useUpdateUserProfile,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import React, { useEffect, useState } from 'react'
import {
  BankInfoForm,
  BankInfoFormData,
} from '../../components/Forms/BankInfoForm'

export const EditBankInfo: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')
  const [bankInfo, setBankInfo] = useState('')
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )

  const { data: settings } = useUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { formatMessage } = useLocale()

  useEffect(() => {
    if (settings?.bankInfo) setBankInfo(settings.bankInfo)
  }, [settings])

  const submitFormData = async (formData: BankInfoFormData) => {
    if (formData.bankInfo === null) {
      setStatus('error')
      return
    }

    if (status !== 'passive') setStatus('passive')

    try {
      // Update the profile if it exists, otherwise create one
      const formattedBankInfo = formData.bankInfo.replace(
        /^(.{4})(.{2})/,
        '$1-$2-',
      )
      if (settings) {
        await updateUserProfile({
          bankInfo: formattedBankInfo,
        })
      }
      setStatus('success')
      toast.success(
        formatMessage({
          id: 'sp.settings:bankInfo-confirmed-saved',
          defaultMessage: 'Bankaupplýsingar vistaðar',
        }),
      )
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'sp.settings:edit-bankInfo',
            defaultMessage: 'Breyta reikningsupplýsingum',
          })}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.settings:edit-bankInfo-description',
                defaultMessage: `
                  Hér getur þú gert breytingar á þeim bankareikningi
                  sem þú vilt nota í kerfum island.is.
                `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <BankInfoForm
        bankInfo={bankInfo}
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
      {status !== 'passive' && (
        <Box marginTop={[5, 7, 15]}>
          {status === 'error' && (
            <AlertMessage
              type="error"
              title={formatMessage({
                id: 'sp.settings:bankInfo-confirmed-error-title',
                defaultMessage: 'Tókst ekki að vista reikningsupplýsingar',
              })}
              message={formatMessage({
                id: 'sp.settings:bankInfo-confirmed-error-subtext',
                defaultMessage:
                  'Eitthvað hefur farið úrskeiðis, vinsamlegast reyndu aftur síðar',
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

export default EditBankInfo
