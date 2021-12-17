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
  useUserProfile,
  useCreateUserProfile,
  useUpdateUserProfile,
} from '@island.is/service-portal/graphql'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { useEffect, useState } from 'react'
import { PhoneForm } from '../../components/Forms/PhoneForm/PhoneForm'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

interface PhoneFormData {
  tel: string
}

export const EditPhoneNumber: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const [tel, setTel] = useState('')
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )

  const { data: settings } = useUserProfile()
  const { createUserProfile } = useCreateUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { formatMessage } = useLocale()

  useEffect(() => {
    if (settings?.mobilePhoneNumber) setTel(settings?.mobilePhoneNumber)
  }, [settings])

  const submitFormData = async (formData: PhoneFormData) => {
    if (status !== 'passive') setStatus('passive')

    const parsePhoneNumber = parsePhoneNumberFromString(formData.tel, 'IS')
    try {
      if (!parsePhoneNumber?.isValid()) {
        throw Error('Not valid phone number')
      }
      if (settings) {
        await updateUserProfile({
          mobilePhoneNumber: `+${parsePhoneNumber?.countryCallingCode}-${parsePhoneNumber?.nationalNumber}`,
        })
      } else {
        await createUserProfile({
          mobilePhoneNumber: `+${parsePhoneNumber?.countryCallingCode}-${parsePhoneNumber?.nationalNumber}`,
        })
      }
      setStatus('success')
      toast.success(
        formatMessage({
          id: 'sp.settings:phone-confirmed-success-subtext',
          defaultMessage: 'Þú hefur vistað nýtt símanúmer hjá Stafrænt Ísland',
        }),
      )
    } catch (err) {
      setStatus('error')
    }
  }

  const phoneNumber = parsePhoneNumberFromString(tel, 'IS')
  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'sp.settings:edit-phone-number',
            defaultMessage: 'Breyta símanúmeri',
          })}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.settings:edit-phone-number-description',
                defaultMessage: `
                  Hér getur þú gert breytingar á þínu símanúmeri.
                  Ath. símanúmerið er notað til þess að senda þér
                  upplýsingar í SMS og ná í þig símleiðis ef þörf krefur.
                `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <PhoneForm
        tel={phoneNumber?.nationalNumber ? `${phoneNumber.nationalNumber}` : ''}
        natReg={userInfo.profile.nationalId}
        renderBackButton={() => (
          <Link to={ServicePortalPath.SettingsPersonalInformation}>
            <Button variant="ghost">{formatMessage(m.goBack)}</Button>
          </Link>
        )}
        submitButtonText={formatMessage({
          id: 'sp.settings:save-changes',
          defaultMessage: 'Vista breytingar',
        })}
        onSubmit={submitFormData}
      />
      {status !== 'passive' && (
        <Box marginTop={[5, 7, 15]}>
          {status === 'error' && (
            <AlertMessage
              type="error"
              title={formatMessage({
                id: 'sp.settings:phone-confirmed-failed-title',
                defaultMessage: 'Tókst ekki að vista símanúmer',
              })}
              message={formatMessage({
                id: 'sp.settings:phone-confirmed-failed-subtext',
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

export default EditPhoneNumber
