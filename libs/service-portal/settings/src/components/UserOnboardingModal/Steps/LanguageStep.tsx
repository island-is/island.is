import React, { FC } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Locale, useLocale } from '@island.is/localization'
import { Field, Form, Formik } from 'formik'
import { FieldSelect } from '../../FieldSelect/FieldSelect'

export type LanguageFormOption = {
  label: string
  value: Locale
}

export interface LanguageFormData {
  language: LanguageFormOption | null
}

interface Props {
  language: LanguageFormOption | null
  onBack: () => void
  onSubmit: (data: LanguageFormData) => void
}

export const LanguageStep: FC<Props> = ({ onBack, onSubmit, language }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:language',
              defaultMessage: 'Tungumál',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:language-form-message',
              defaultMessage: `
                Vinsamlegast veldu tungumálið sem þú vilt
                nota í kerfum island.is
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
      <Formik
        initialValues={{
          language,
        }}
        onSubmit={onSubmit}
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
            <Box display="flex" justifyContent="spaceBetween" marginTop={6}>
              <Button variant="ghost" onClick={onBack}>
                {formatMessage({
                  id: 'service.portal:go-back',
                  defaultMessage: 'Til baka',
                })}
              </Button>
              <Button variant="primary" type="submit" icon="arrowForward">
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
