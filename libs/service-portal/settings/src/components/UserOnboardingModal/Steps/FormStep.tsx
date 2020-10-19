import { User } from 'oidc-client'
import React, { ChangeEvent, FC, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FieldInput } from '../../FieldInput/FieldInput'

export interface UserProfileFormData {
  name: string
  email: string
  tel: string
}

interface Props {
  userInfo: User
  onBack: () => void
  onClose: () => void
  onSubmit: (data: UserProfileFormData) => void
}

export const FormStep: FC<Props> = ({ userInfo, onBack, onSubmit }) => {
  const { formatMessage } = useLocale()

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
          name: userInfo.profile.name || '',
          email: '',
          tel: '',
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Skylda er að taka fram nafn'),
          email: Yup.string()
            .email('Netfangið er ekki á réttu formi')
            .required('Skylda er að fylla út netfang'),
          tel: Yup.string()
            .length(7, 'Símanúmer getur eingöngu verið 7 stafir á lengd')
            .required('Skylda er að fylla út símanúmer'),
        })}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <Box marginBottom={2}>
              <Field component={FieldInput} label="Nafn" name="name" />
            </Box>
            <Box marginBottom={2}>
              <Field component={FieldInput} label="Netfang" name="email" />
            </Box>
            <Box marginBottom={2}>
              <Field component={FieldInput} label="Símanúmer" name="tel" />
            </Box>
            <Box display="flex" justifyContent="spaceBetween" marginTop={6}>
              <Button variant="ghost" onClick={onBack}>
                {formatMessage({
                  id: 'service.portal:finish-later',
                  defaultMessage: 'Klára seinna',
                })}
              </Button>
              <Button variant="primary" type="submit" icon="arrowRight">
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
