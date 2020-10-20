import React, { FC } from 'react'
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

export interface PhoneFormData {
  tel: string
}

interface Props {
  tel: string
  onBack: () => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneStep: FC<Props> = ({ onBack, onSubmit, tel }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:tel-number',
              defaultMessage: 'Símanúmer',
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
          tel,
        }}
        validationSchema={Yup.object().shape({
          tel: Yup.string()
            .length(7, 'Símanúmer getur eingöngu verið 7 stafir á lengd')
            .required('Skylda er að fylla út símanúmer'),
        })}
        onSubmit={onSubmit}
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
            <Box display="flex" justifyContent="spaceBetween" marginTop={6}>
              <Button variant="ghost" onClick={onBack}>
                {formatMessage({
                  id: 'service.portal:go-back',
                  defaultMessage: 'Til baka',
                })}
              </Button>
              <Button variant="primary" type="submit" icon="arrowRight">
                {formatMessage({
                  id: 'service.portal:next-step',
                  defaultMessage: 'Næsta skref',
                })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  )
}
