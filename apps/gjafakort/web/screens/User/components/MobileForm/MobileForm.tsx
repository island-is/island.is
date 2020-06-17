import React from 'react'
import gql from 'graphql-tag'
import { Formik, Form, Field, FormikValues } from 'formik'
import * as Yup from 'yup'

import {
  FieldInput,
  FieldNumberInput,
  FieldCheckbox,
  Box,
  Tiles,
  Stack,
  Button,
  Typography,
  FieldSelect,
  FieldPolarQuestion,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { FormLayout } from '@island.is/gjafakort-web/components'

interface PropTypes {
  onSubmit: (_: FormikValues) => void
}

function MobileForm({ onSubmit }: PropTypes) {
  const {
    t: {
      user: { mobileForm: t },
      validation,
    },
  } = useI18n()

  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          {t.title}
        </Typography>
      </Box>
      <Box marginBottom={6}>
        <Typography variant="intro">{t.intro}</Typography>
      </Box>
      <Formik
        initialValues={{}}
        validate={(values) => {
          if (values.phoneNumber !== values.confirmPhoneNumber) {
            return {
              confirmPhoneNumber: t.validation.confirmPhoneNumber,
            }
          }

          return {}
        }}
        validationSchema={Yup.object().shape({
          phoneNumber: Yup.string()
            .length(7, validation.phoneNumber)
            .required(validation.required),
          confirmPhoneNumber: Yup.string().required(validation.required),
        })}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, isValid, dirty }) => (
          <Form>
            <Box marginBottom={5}>
              <Stack space={3}>
                <Field
                  component={FieldNumberInput}
                  label={t.form.phoneNumber.label}
                  name="phoneNumber"
                  htmltype="tel"
                  format="### ####"
                />
                <Field
                  component={FieldNumberInput}
                  label={t.form.confirmPhoneNumber.label}
                  name="confirmPhoneNumber"
                  htmltype="tel"
                  format="### ####"
                />
              </Stack>
            </Box>
            <Button htmlType="submit" disabled={!dirty || !isValid}>
              {t.form.submit}
            </Button>
          </Form>
        )}
      </Formik>
    </FormLayout>
  )
}

export default MobileForm
