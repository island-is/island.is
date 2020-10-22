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
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { FieldInput } from '../../components/FieldInput/FieldInput'

interface PhoneFormData {
  tel: string
}

export const EditPhoneNumber: ServicePortalModuleComponent = ({ userInfo }) => {
  const [tel, setTel] = useState('')
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)
  const [status, setStatus] = useState<'passive' | 'success' | 'error'>(
    'passive',
  )
  const { formatMessage } = useLocale()
  const { createUserProfile } = useCreateUserProfile(userInfo.profile.natreg)
  const { updateUserProfile } = useUpdateUserProfile(userInfo.profile.natreg)

  useEffect(() => {
    if (!userProfile) return
    if (userProfile.mobilePhoneNumber.length > 0)
      setTel(userProfile.mobilePhoneNumber)
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
      <Formik
        initialValues={{
          tel,
        }}
        validationSchema={Yup.object().shape({
          tel: Yup.string()
            .length(7, 'Símanúmer getur eingöngu verið 7 stafir á lengd')
            .required('Skylda er að fylla út símanúmer'),
        })}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form>
            <Box>
              <Field
                component={FieldInput}
                label="Símanúmer"
                name="tel"
                placeholder="Símanúmer"
              />
            </Box>
            <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
              <Link to={ServicePortalPath.UserProfileRoot}>
                <Button variant="ghost">
                  {formatMessage({
                    id: 'service.portal:go-back',
                    defaultMessage: 'Til baka',
                  })}
                </Button>
              </Link>
              <Button type="submit" variant="primary" icon="arrowForward">
                {formatMessage({
                  id: 'sp.settings:save-changes',
                  defaultMessage: 'Vista breytingar',
                })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      {status !== 'passive' && (
        <Box marginTop={[5, 7, 15]}>
          {status === 'success' && (
            <AlertMessage
              type="success"
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
