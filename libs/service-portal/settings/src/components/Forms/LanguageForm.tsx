import { Box } from '@island.is/island-ui/core'
import { Locale } from '@island.is/localization'
import { Field, Form, Formik } from 'formik'
import React, { FC } from 'react'
import { FieldSelect } from '../FieldSelect/FieldSelect'

export type LanguageFormOption = {
  label: string
  value: Locale
}

export interface LanguageFormData {
  language: LanguageFormOption | null
}

interface Props {
  language: LanguageFormOption | null
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: LanguageFormData) => void
}

export const LanguageForm: FC<Props> = ({
  language,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={{
        language,
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {() => (
        <Form>
          <Box>
            <Field
              component={FieldSelect}
              label="Tungumál"
              name="language"
              placeholder="Tungumál"
              options={[
                { label: 'Íslenska', value: 'is' },
                { label: 'English', value: 'en' },
              ]}
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
