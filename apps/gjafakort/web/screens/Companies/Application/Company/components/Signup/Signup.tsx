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

const CreateApplicationMutation = gql`
  mutation CreateApplicationMutation($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`

const emailValidation = Yup.string()
  .email('Netfang ekki gilt')
  .required('Þessi reitur má ekki vera tómur')

const SignupSchema = Yup.object().shape({
  companyDisplayName: Yup.string().required('Þessi reitur má ekki vera tómur'),
  serviceCategory: Yup.object()
    .nullable()
    .required('Þessi reitur má ekki vera tómur'),
  name: Yup.string().required('Þessi reitur má ekki vera tómur'),
  email: emailValidation,
  generalEmail: emailValidation,
  phoneNumber: Yup.string()
    .length(7, 'Símanúmer þarf að vera sjö tölustafir')
    .required('Þessi reitur má ekki vera tómur'),
  operationsTrouble: Yup.bool().required('Velja þarf annaðhvort svarið'),
})

function Signup({ company, handleSubmission }: PropTypes) {
  const {
    t: {
      company: { signup: t },
    },
  } = useI18n()
  const [createApplication] = useMutation(CreateApplicationMutation)

  const companyOperations = t.form.operation.options

  const onSubmit = async (values) => {
    if (values.noneOfTheAbove) {
      return handleSubmission(false)
    }

    await createApplication({
      variables: {
        input: {
          ...values,
          operations: undefined,
          noneOfTheAbove: undefined,
          serviceCategory: values.serviceCategory.label,
          ...values.operations,
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
              errors['operations'][o.name] =
                'Velja þarf minnst einn reit eða "Ekkert að ofangreindu á við"'
            })
          }
          return errors
        }}
        validationSchema={SignupSchema}
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
                    disabled={values.noneOfTheAbove}
                  />
                ))}
                <Field
                  component={FieldCheckbox}
                  name="noneOfTheAbove"
                  label="Ekkert af ofangreindu á við"
                  tooltip="Ef ekkert að ofangreindu á við er fyrirtæki ekki gjaldgengur þátttakandi í Ferðagjöfinni skv. lögum um Ferðagjöf."
                  onChange={() => {
                    // we want this to run in the next render cycle so "noneOfTheAbove" is true before we uncheck all operations
                    setTimeout(() => {
                      companyOperations.forEach((o) => {
                        if (values.operations[o.name]) {
                          setFieldValue(`operations.${o.name}`, false)
                        }
                      })
                    }, 0)
                  }}
                />
              </Stack>
            </Box>
            <Box marginBottom={5}>
              <Field
                component={FieldPolarQuestion}
                name="operationsTrouble"
                positiveLabel="Já"
                negativeLabel="Nei"
                label="Var fyrirtæki þitt í rekstrarerfiðleikum 31. desember 2019 í skilningi hópundanþágureglugerðar"
                tooltip="Fyrirtæki sem metið var í rekstrarerfiðleikum 31. desember 2019 í skilningi hópundanþágureglugerðar (ESB) nr. 651/2014 getur að hámarki tekið við samanlagt 25 millj. kr. greiðslu í formi ferðagjafa."
                reverse
              />
            </Box>
            <Box marginBottom={5}>
              <Stack space={3}>
                <Typography variant="h4" as="h2">
                  Tengiliður
                </Typography>
                <Field component={FieldInput} label="Nafn" name="name" />
                <Field component={FieldInput} label="Netfang" name="email" />
                <Field
                  component={FieldInput}
                  label="Almennt netfang"
                  name="generalEmail"
                />
                <Field component={FieldInput} label="Vefsíða" name="webpage" />
                <Field
                  component={FieldNumberInput}
                  label="Símanúmer"
                  name="phoneNumber"
                  htmltype="tel"
                  format="### ####"
                />
              </Stack>
            </Box>
            <Button htmlType="submit">Skrá fyrirtækið mitt</Button>
          </Form>
        )}
      </Formik>
    </FormLayout>
  )
}

export default Signup
