import { Box } from '@island.is/island-ui/core'
import { Field, Form, Formik } from 'formik'
import React, { FC } from 'react'
import * as Yup from 'yup'
import { FieldInput } from '../FieldInput/FieldInput'

export interface PhoneFormData {
  tel: string
}

interface Props {
  tel: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneForm: FC<Props> = ({
  tel,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  return (
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
