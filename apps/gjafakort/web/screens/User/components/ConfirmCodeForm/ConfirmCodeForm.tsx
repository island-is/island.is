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
  sendConfirmationSMS: () => void
}

function ConfirmCodeForm({ onSubmit, sendConfirmationSMS }: PropTypes) {
  const {
    t: {
      user: { confirmCodeForm: t },
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
        <Typography variant="p">
          {t.noSMS}{' '}
          <Button variant="text" onClick={sendConfirmationSMS}>
            {t.sendSMSButton}
          </Button>
        </Typography>
      </Box>
      <Formik
        initialValues={{
          confirmCode: '',
        }}
        validationSchema={Yup.object().shape({
          confirmCode: Yup.string()
            .length(6, t.validation.confirmCode)
            .required(validation.required),
        })}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack space={5}>
              <Field
                component={FieldNumberInput}
                label={t.form.confirmCode.label}
                name="confirmCode"
                format="######"
              />
              <Button htmlType="submit" disabled={isSubmitting}>
                {t.form.submit}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </FormLayout>
  )
}

export default ConfirmCodeForm
