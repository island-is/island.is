import React from 'react'
import { Formik, Form, Field, FormikValues, FormikHelpers } from 'formik'
import * as Yup from 'yup'

import {
  FieldNumberInput,
  Box,
  Stack,
  Button,
  Typography,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { FormLayout } from '@island.is/gjafakort-web/components'

interface PropTypes {
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => void
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
        initialValues={{
          phoneNumber: '',
          confirmPhoneNumber: '',
        }}
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
        {({ isSubmitting, values, isValidating, errors }) => (
          <Form>
            {console.log(values, isValidating, errors)}
            <Box marginBottom={5}>
              <Stack space={3}>
                <Field
                  component={FieldNumberInput}
                  label={t.form.phoneNumber.label}
                  name="phoneNumber"
                  format="+354 ### ####"
                  allowEmptyFormatting
                />
                <Field
                  component={FieldNumberInput}
                  label={t.form.confirmPhoneNumber.label}
                  name="confirmPhoneNumber"
                  format="+354 ### ####"
                  allowEmptyFormatting
                />
              </Stack>
            </Box>
            <Button htmlType="submit" disabled={isSubmitting}>
              {t.form.submit}
            </Button>
          </Form>
        )}
      </Formik>
    </FormLayout>
  )
}

export default MobileForm
