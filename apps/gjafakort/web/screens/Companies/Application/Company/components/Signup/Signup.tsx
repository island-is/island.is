import React from 'react'
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
import { Company } from '@island.is/gjafakort-web/graphql/schema'
import { FormLayout } from '@island.is/gjafakort-web/components'

interface PropTypes {
  company: Company
  handleSubmition: (_: boolean) => void
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

const companyOperations = [
  {
    name: 'validPermit',
    label: 'Fyrirtæki með gilt starfsleyfi Ferðamálastofu',
    tooltip:
      'Fyrirtæki með gilt leyfi Ferðamálastofu skv. III. kafla laga um Ferðamálastofu, nr. 96/2018.',
  },
  {
    name: 'validLicenses',
    label:
      'Fyrirtæki með rekstrarleyfi vegna veitingastaða, gististaða og skemmtanahalds',
    tooltip:
      'Fyrirtæki með gilt rekstrarleyfi skv. 7. gr. laga um veitingastaði, gististaði og skemmtanahald, nr. 85/2007.',
  },
  {
    name: 'operatingPermitForRestaurant',
    label: 'Fyrirtæki með starfsleyfi vegna veitingastaða',
    tooltip:
      'Fyrirtæki með gilt starfsleyfi frá viðeigandi heilbrigðisnefnd sem hefur verið gefið út vegna veitingastaða í flokki I, sbr. 3. mgr. 4. gr. laga um veitingastaði, gististaði og skemmtanahald, nr. 85/2007.',
  },
  {
    name: 'operatingPermitForVehicles',
    label: 'Fyrirtæki með starfsleyfi vegna leigu skráningarskyldra ökutækja',
    tooltip:
      'Ökutækjaleigur með gilt starfsleyfi frá Samgöngustofu skv. 1. mgr. 3. gr. laga um leigu skráningarskyldra ökutækja, nr. 65/2015.',
  },
  {
    name: 'exhibition',
    label: 'Sýning sem gerir út á náttúru, menningu eða sögu',
    tooltip:
      'Söfn og fyrirtæki sem bjóða sýningu gegn endurgjaldi þar sem áhersla er á íslenska náttúru, menningu eða sögu.',
  },
]

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

function Signup({ company, handleSubmition }: PropTypes) {
  const [createApplication] = useMutation(CreateApplicationMutation)
  const onSubmit = async (values) => {
    if (values.noneOfTheAbove) {
      return handleSubmition(false)
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
    return handleSubmition(true)
  }

  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          {company.name}
        </Typography>
      </Box>
      <Box marginBottom={6}>
        <Typography variant="intro">
          Fylltu inn upplýsingar hér að neðan
        </Typography>
      </Box>
      <Formik
        initialValues={{
          companySSN: company.ssn,
          companyName: company.name,
          companyDisplayName: company.application?.companyDisplayName,
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
                  label="Nafn fyrirtækis"
                  name="companyName"
                  disabled
                />
                <Field
                  component={FieldNumberInput}
                  label="Kennitala"
                  disabled
                  name="companySSN"
                  format="######-####"
                />
                <Field
                  component={FieldInput}
                  label="Hjáheiti"
                  name="companyDisplayName"
                  tooltip="Nafn fyrirtækis sem birtist í smáforritinu og á vefsíðunni Ferðalag.is"
                />
                <Field
                  component={FieldSelect}
                  name="serviceCategory"
                  label="Þjónustuflokkur"
                  placeholder="Veldu flokk"
                  options={[
                    {
                      label: 'Afþreying',
                      value: 'entertainment',
                    },

                    {
                      label: 'Gisting',
                      value: 'accommodation',
                    },

                    {
                      label: 'Veitingar',
                      value: 'restaurant',
                    },

                    {
                      label: 'Samgöngur',
                      value: 'transport',
                    },

                    {
                      label: 'Menning',
                      value: 'culture',
                    },
                  ]}
                />
              </Tiles>
            </Box>
            <Box marginBottom={6}>
              <Box marginBottom={1}>
                <Typography variant="h4" as="h2">
                  Starfsemi fyrirtækis
                </Typography>
              </Box>
              <Stack space={5}>
                <Typography variant="p">
                  Vinsamlegast hakaðu við viðeigandi tegund starfssemi
                  fyrirtækis. Hægt er að haka við fleiri en einn valmöguleika.
                  <br />
                  Vakin er athygli á að listi yfir fyrirtæki sem taka við
                  greiðslu í formi Ferðagjafar verður birtur á vefnum
                  Ferðalag.is
                </Typography>
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
