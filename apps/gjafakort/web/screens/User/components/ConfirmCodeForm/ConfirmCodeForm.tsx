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

function ConfirmCodeForm({ onSubmit }: PropTypes) {
  const {
    t: {
      user: { confirmCodeForm: t },
      validation,
    },
  } = useI18n()

  // TODO put a link to resend the sms confirmation @Brian

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
        validationSchema={Yup.object().shape({
          confirmCode: Yup.string()
            .length(6, t.validation.confirmCode)
            .required(validation.required),
        })}
        onSubmit={onSubmit}
      >
        {({ isValid, dirty }) => (
          <Form>
            <Box marginBottom={5}>
              <Stack space={3}>
                <Field
                  component={FieldNumberInput}
                  label={t.form.confirmCode.label}
                  name="confirmCode"
                  format="######"
                  allowEmptyFormatting
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

export default ConfirmCodeForm
