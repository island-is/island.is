import { Box } from '@island.is/island-ui/core'
import { Field, Form, Formik } from 'formik'
import React, { FC } from 'react'
import * as Yup from 'yup'
import { FieldInput } from '../FieldInput/FieldInput'

export interface EmailFormData {
  email: string
}

interface Props {
  email: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: EmailFormData) => void
}

export const EmailForm: FC<Props> = ({
  email,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  return (
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
      enableReinitialize
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
          {(renderBackButton || renderSubmitButton) && (
            <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
              {renderBackButton && renderBackButton()}
              {renderSubmitButton && renderSubmitButton()}
            </Box>
          )}
        </Form>
      )}
    </Formik>
  )
}
