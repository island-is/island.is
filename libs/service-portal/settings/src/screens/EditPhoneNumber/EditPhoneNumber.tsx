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
import {
  PhoneForm,
  PhoneFormInternalState,
} from '../../components/Forms/PhoneForm'

interface PhoneFormData {
  tel: string
}

export const EditPhoneNumber: ServicePortalModuleComponent = ({ userInfo }) => {
  const [tel, setTel] = useState('')
  const [formState, setFormState] = useState<PhoneFormInternalState>({
    step: 'phone',
    tel: '',
  })
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )
  const { formatMessage } = useLocale()
  const { createUserProfile } = useCreateUserProfile(userInfo.profile.natreg)
  const { updateUserProfile } = useUpdateUserProfile(userInfo.profile.natreg)

  useEffect(() => {
    if (!userProfile) return
    if (userProfile.mobilePhoneNumber.length > 0) {
      setTel(userProfile.mobilePhoneNumber)
      setFormState({ step: 'phone', tel: userProfile.mobilePhoneNumber })
    }
  }, [userProfile])

  const submitFormData = async (formData: PhoneFormData) => {
    if (status !== 'passive') setStatus('passive')

    try {
      // Update the profile if it exists, otherwise create one
      if (userProfile) {
        await updateUserProfile({
          mobilePhoneNumber: formData.tel,
        })
      } else {
        await createUserProfile({
          mobilePhoneNumber: formData.tel,
        })
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  const handleSubmit = (data: PhoneFormData) => {
    submitFormData(data)
  }

  return (
    <>
      <Box marginBottom={4}>
        <Text variant="h1">
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
        tel={tel}
        natReg={userInfo.profile.natreg}
        onInternalStateChange={(state) => setFormState(state)}
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
            {formState.step === 'phone'
              ? formatMessage({
                  id: 'sp.settings:confirm-code',
                  defaultMessage: 'Senda staðfestingarkóða',
                })
              : formatMessage({
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
              type="info"
              title="Nýtt símanúmer hefur verið vistað"
              message="Þú hefur vistað nýtt símanúmer hjá Stafrænt Ísland"
            />
          )}
          {status === 'error' && (
            <AlertMessage
              type="error"
              title="Tókst ekki að vista símanúmer"
              message="Eitthvað hefur farið úrskeiðis, vinsamlegast reyndu aftur síðar"
            />
          )}
        </Box>
      )}
    </>
  )
}

export default EditPhoneNumber
