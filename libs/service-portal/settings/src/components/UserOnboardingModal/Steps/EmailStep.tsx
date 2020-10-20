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

export interface EmailFormData {
  email: string
}

interface Props {
  email: string
  onBack: () => void
  onSubmit: (data: EmailFormData) => void
}

export const EmailStep: FC<Props> = ({ onBack, onSubmit, email }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:email',
              defaultMessage: 'Netfang',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:email-form-message',
              defaultMessage: `
                Vinsamlegt settu inn nefangið þitt.
                Við komum til með að senda á þig staðfestingar og tilkynningar.
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
      <Formik
        initialValues={{
          email,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Netfangið er ekki á réttu formi')
            .required('Skylda er að fylla út netfang'),
        })}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <Box>
              <Field
                component={FieldInput}
                label="Netfang"
                name="email"
                placeholder="Netfang"
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
