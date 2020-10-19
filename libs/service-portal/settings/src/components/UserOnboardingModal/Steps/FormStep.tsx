import { User } from 'oidc-client'
import React, { ChangeEvent, FC, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FieldInput } from '../../FieldInput/FieldInput'
import { useMutation } from '@apollo/client'
import { CREATE_USER_PROFILE } from '@island.is/service-portal/graphql'
import { Mutation, MutationCreateProfileArgs } from '@island.is/api/schema'

export interface UserProfileFormData {
  email: string
  tel: string
}

interface Props {
  userInfo: User
  onBack: () => void
  onClose: () => void
  onSubmit: () => void
}

export const FormStep: FC<Props> = ({
  userInfo,
  onBack,
  onClose,
  onSubmit,
}) => {
  const { formatMessage } = useLocale()
  const [createUserProfile, { loading }] = useMutation<
    Mutation,
    MutationCreateProfileArgs
  >(CREATE_USER_PROFILE)

  const submitFormData = async (data: UserProfileFormData) => {
    try {
      const res = await createUserProfile({
        variables: {
          input: {
            email: data.email,
            locale: 'is',
            mobilePhoneNumber: data.tel,
            nationalId: userInfo.profile.natreg,
          },
        },
      })

      onSubmit()
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handleFormSubmit = (data: UserProfileFormData) => {
    submitFormData(data)
  }

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:info',
              defaultMessage: 'Upplýsingar',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:profile-info-form-message',
              defaultMessage: `
                Vinsamlegast gerðu breytingar á þessum upplýsingum
                ef þörf krefur.
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
      <Formik
        initialValues={{
          email: '',
          tel: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Netfangið er ekki á réttu formi')
            .required('Skylda er að fylla út netfang'),
          tel: Yup.string()
            .length(7, 'Símanúmer getur eingöngu verið 7 stafir á lengd')
            .required('Skylda er að fylla út símanúmer'),
        })}
        onSubmit={handleFormSubmit}
      >
        {() => (
          <Form>
            <Box marginBottom={2}>
              <Field
                component={FieldInput}
                label="Netfang"
                name="email"
                disabled={loading}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                component={FieldInput}
                label="Símanúmer"
                name="tel"
                disabled={loading}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              marginTop={6}
              disabled={loading}
            >
              <Button variant="ghost" disabled={loading} onClick={onBack}>
                {formatMessage({
                  id: 'service.portal:finish-later',
                  defaultMessage: 'Klára seinna',
                })}
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon="arrowRight"
                disabled={loading}
              >
                {formatMessage({
                  id: 'service.portal:save-data',
                  defaultMessage: 'Vista upplýsingar',
                })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  )
}
