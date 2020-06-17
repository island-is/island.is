import React from 'react'
import HtmlParser from 'react-html-parser'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Formik, Form, Field } from 'formik'
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
import { Company } from '@island.is/gjafakort-web/graphql/schema'
import { FormLayout } from '@island.is/gjafakort-web/components'

interface PropTypes {
  company: Company
  handleSubmission: (_: boolean) => void
}

const CreateCompanyApplicationMutation = gql`
  mutation CreateCompanyApplicationMutation(
    $input: CreateCompanyApplicationInput!
  ) {
    createCompanyApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/gi

function Signup({ company, handleSubmission }: PropTypes) {
  const {
    t: {
      company: { signup: t },
      validation,
    },
  } = useI18n()
  const [createCompanyApplication] = useMutation(
    CreateCompanyApplicationMutation,
  )

  const companyOperations = t.form.operation.options

  const onSubmit = async (values) => {
    if (values.operations.noneOfTheAbove) {
      return handleSubmission(false)
    }

    await createCompanyApplication({
      variables: {
        input: {
          ...values,
          ...values.operations,
          serviceCategory: values.serviceCategory.label,
          operations: undefined,
          noneOfTheAbove: undefined,
        },
      },
    })
    return handleSubmission(true)
  }

  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          {company.name}
        </Typography>
      </Box>
      <Box marginBottom={6}>
        <Typography variant="intro">{t.intro}</Typography>
      </Box>
      <Formik
        initialValues={{
          companySSN: company.ssn,
          companyName: company.name,
          companyDisplayName:
            company.application?.companyDisplayName ?? company.name,
          serviceCategory: company.application?.serviceCategory,
          name: company.application?.name,
          email: company.application?.email,
          generalEmail: company.application?.generalEmail,
          webpage: company.application?.webpage,
          phoneNumber: company.application?.phoneNumber.replace(/-/g, ''),
          operations: companyOperations.reduce((acc, o) => {
            acc[o.name] = false
            return acc
          }, {}),
          noneOfTheAbove: false,
          operationsTrouble: undefined,
        }}
        validate={(values) => {
          const errors = {}
          const noOperations = companyOperations.every(
            (o) => !values.operations[o.name],
          )
          if (!values.noneOfTheAbove && noOperations) {
            errors['operations'] = {}
            companyOperations.forEach((o) => {
              errors['operations'][o.name] = t.form.validation.operations
            })
          }
          return errors
        }}
        validationSchema={Yup.object().shape({
          companyDisplayName: Yup.string().required(validation.required),
          serviceCategory: Yup.object()
            .nullable()
            .required(validation.required),
          name: Yup.string().required(validation.required),
          email: Yup.string()
            .email(validation.email)
            .required(validation.required),
          generalEmail: Yup.string()
            .email(validation.email)
            .required(validation.required),
          phoneNumber: Yup.string()
            .length(7, validation.phoneNumber)
            .required(validation.required),
          operationsTrouble: Yup.bool().required(
            t.form.validation.operationsTrouble,
          ),
          webpage: Yup.string()
            .matches(urlRegex, validation.webpage)
            .required(validation.required),
        })}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Box marginBottom={6}>
              <Tiles columns={[1, 1, 2]} space={3}>
                <Field
                  component={FieldInput}
                  label={t.form.companyName.label}
                  name="companyName"
                  disabled
                />
                <Field
                  component={FieldNumberInput}
                  label={t.form.companySSN.label}
                  disabled
                  name="companySSN"
                  format="######-####"
                />
                <Field
                  component={FieldInput}
                  label={t.form.companyDisplayName.label}
                  name="companyDisplayName"
                  tooltip={t.form.companyDisplayName.tooltip}
                />
                <Field
                  component={FieldSelect}
                  name="serviceCategory"
                  label={t.form.serviceCategory.label}
                  placeholder={t.form.serviceCategory.placeholder}
                  options={t.form.serviceCategory.options}
                />
              </Tiles>
            </Box>
            <Box marginBottom={6}>
              <Box marginBottom={1}>
                <Typography variant="h4" as="h2">
                  {t.form.operation.label}
                </Typography>
              </Box>
              <Stack space={5}>
                {t.form.operation.instructions.map((instruction, index) => (
                  <Typography variant="p" key={index}>
                    {HtmlParser(instruction)}
                  </Typography>
                ))}
                {companyOperations.map((operation) => (
                  <Field
                    key={operation.name}
                    component={FieldCheckbox}
                    name={`operations.${operation.name}`}
                    tooltip={operation.tooltip}
                    label={operation.label}
                    disabled={
                      operation.name !== 'noneOfTheAbove' &&
                      values.operations.noneOfTheAbove
                    }
                    onChange={() => {
                      if (operation.name === 'noneOfTheAbove') {
                        // we want this to run in the next render cycle
                        // so "noneOfTheAbove" is true before we uncheck all operations
                        setTimeout(() => {
                          companyOperations.forEach((o) => {
                            if (values.operations[o.name]) {
                              setFieldValue(`operations.${o.name}`, false)
                            }
                          })
                        }, 0)
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <Box marginBottom={5}>
              <Field
                component={FieldPolarQuestion}
                name="operationsTrouble"
                positiveLabel={t.form.operationsTrouble.positiveLabel}
                negativeLabel={t.form.operationsTrouble.negativeLabel}
                label={t.form.operationsTrouble.label}
                tooltip={t.form.operationsTrouble.tooltip}
                reverse
              />
            </Box>
            <Box marginBottom={5}>
              <Stack space={3}>
                <Typography variant="h4" as="h2">
                  {t.form.contact.label}
                </Typography>
                <Field
                  component={FieldInput}
                  label={t.form.contact.name}
                  name="name"
                />
                <Field
                  component={FieldInput}
                  label={t.form.contact.email}
                  name="email"
                />
                <Field
                  component={FieldInput}
                  label={t.form.contact.generalEmail}
                  name="generalEmail"
                />
                <Field
                  component={FieldInput}
                  label={t.form.contact.webpage}
                  name="webpage"
                />
                <Field
                  component={FieldNumberInput}
                  label={t.form.contact.phoneNumber}
                  name="phoneNumber"
                  htmltype="tel"
                  format="### ####"
                />
              </Stack>
            </Box>
            <Button htmlType="submit">{t.form.submit}</Button>
          </Form>
        )}
      </Formik>
    </FormLayout>
  )
}

export default Signup
