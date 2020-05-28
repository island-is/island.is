import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import {
  FieldInput,
  FieldNumberInput,
  FieldCheckbox,
  Box,
  ContentBlock,
  Column,
  Columns,
  Tiles,
  Stack,
  Button,
  Typography,
  FieldSelect,
} from '@island.is/island-ui/core'

export type CompanyType = {
  name: string
  ssn: string | number
}

interface PropTypes {
  company: CompanyType
  onSubmit: () => void
}

const companyOperations = [
  {
    name: 'validPermit',
    label: 'Fyrirtæki með gilt starfsleyfi Ferðamálastofu',
    tooltip: 'test',
  },
  {
    name: 'validLicenses',
    label:
      'Fyrirtæki með rekstrarleyfi vegna veitingastaða, gististaða og skemmtanahalds',
    tooltip: 'test',
  },
  {
    name: 'operatingPermitForVehicles',
    label: 'Fyrirtæki með starfsleyfi vegna leigu skráningarskyldra ökutækja',
    tooltip: 'test',
  },
  {
    name: 'acknowledgedMuseum',
    label: 'Safn viðurkennt skv. safnalögum',
    tooltip: 'test',
  },
  {
    name: 'exhibition',
    label: 'Sýning sem gerir út á náttúru eða menningu eða sögu',
    tooltip: 'test',
  },
  {
    name: 'followingLaws',
    label:
      'Fyrirtæki í atvinnurekstri á grundvelli laga um hollustuhætti og mengunarvarnar s.s. baðstofur, gufubaðsstofur, götuleikhús, tvívolu, útihátíðir, tjald og hjólhýsasvæði',
    tooltip: 'test',
  },
  {
    name: 'noneOfTheAbove',
    label: 'Ekkert að ofangreindu á við',
    tooltip: 'test',
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
  approveTerms: Yup.bool().oneOf(
    [true],
    'Það þarf að samþykkja skilmála til að halda áfram',
  ),
})

function Signup({ company, onSubmit }: PropTypes) {
  return (
    <ContentBlock width="large">
      <Columns space="gutter" collapseBelow="lg">
        <Column width="2/3">
          <Box
            background="blue100"
            paddingX={[5, 12]}
            paddingY={[5, 9]}
            marginTop={12}
          >
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
                companyName: company.name,
                ssn: company.ssn,
                companyDisplayName: company.name,
                serviceCategory: null,
                name: '',
                email: '',
                generalEmail: '',
                webpage: '',
                phoneNumber: '',
                approveTerms: false,
              }}
              validationSchema={SignupSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {() => (
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
                        name="ssn"
                        format="######-####"
                      />
                      <Field
                        component={FieldInput}
                        label="Nafn fyrirtækis útávið"
                        name="companyDisplayName"
                        tooltip="test"
                      />
                      <Field
                        component={FieldSelect}
                        name="serviceCategory"
                        label="Þjónustuflokkur"
                        placeholder="Veldu flokk"
                        options={[
                          {
                            label: 'Veitingastaður',
                            value: 'resturant',
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
                        Vinsamlegast hakaðu við viðeigandi tegund starfsemi
                        fyrirtækis. Hægt er að haka við einn eða fleiri
                        möguleika.
                      </Typography>
                      {companyOperations.map((operation) => (
                        <Field
                          key={operation.name}
                          component={FieldCheckbox}
                          {...operation}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <Stack space={3}>
                    <Typography variant="h4" as="h2">
                      Tengiliður
                    </Typography>
                    <Field component={FieldInput} label="Nafn" name="name" />
                    <Field
                      component={FieldInput}
                      label="Netfang"
                      name="email"
                    />
                    <Field
                      component={FieldInput}
                      label="Almennt netfang"
                      name="generalEmail"
                    />
                    <Field
                      component={FieldInput}
                      label="Vefsíða"
                      name="webpage"
                    />
                    <Field
                      component={FieldNumberInput}
                      label="Símanúmer"
                      name="phoneNumber"
                      htmltype="tel"
                      format="### ####"
                    />
                  </Stack>
                  <Box marginY={5}>
                    <Field
                      component={FieldCheckbox}
                      name="approveTerms"
                      label="Ég samþykki skilmála Ferðagjafarinnar"
                    />
                  </Box>
                  <Button htmlType="submit">Skrá fyrirtækið mitt</Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}

export default Signup
