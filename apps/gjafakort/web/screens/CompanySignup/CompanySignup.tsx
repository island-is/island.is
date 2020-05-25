import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
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
} from '@island.is/island-ui/core'

// TODO: move this to a more central place or use another if it already excists
const isEmailValid = (email) => {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  return re.test(email)
}

const companyOperations = [
  {
    name: 'validPermit',
    label: 'Fyrirtæki með gilt starfsleyfi Ferðamálastofu',
  },
  {
    name: 'validLicenses',
    label:
      'Fyrirtæki með rekstrarleyfi vegna veitingastaða, gististaða og skemmtanahalds',
  },
  {
    name: 'operatingPermitForVehicles',
    label: 'Fyrirtæki með starfsleyfi vegna leigu skráningarskyldra ökutækja',
  },
  {
    name: 'acknowledgedMuseum',
    label: 'Safn viðurkennt skv. safnalögum',
  },
  {
    name: 'exhibition',
    label: 'Sýning sem gerir út á náttúru eða menningu eða sögu',
  },
  {
    name: 'followingLaws',
    label:
      'Fyrirtæki í atvinnurekstri á grundvelli laga um hollustuhætti og mengunarvarnar s.s. baðstofur, gufubaðsstofur, götuleikhús, tvívolu, útihátíðir, tjald og hjólhýsasvæði',
  },
  {
    name: 'noneOfTheAbove',
    label: 'Ekkert að ofangreindu á við',
  },
]

function CompanySignup() {
  const companyName = 'Kaffi klettur'
  const ssn = '1902795829'
  const isat = 'IS-5978512'
  const serviceCategory = 'Veitingastaður'
  const address = 'Biskupsbraut 18'
  const postNumber = '230'
  const intro = 'Fylltu inn upplýsingar hér að neðan'
  return (
    <ContentBlock width="large">
      <Columns space="gutter" collapseBelow="lg">
        <Column width="2/3">
          <Box
            background="blue100"
            paddingX={['spacer5', 'spacer12']}
            paddingY={['spacer5', 'spacer9']}
            borderRadius="standard"
            marginTop="spacer12"
          >
            <Box marginBottom="spacer2">
              <Typography variant="h1" as="h1">
                {companyName}
              </Typography>
            </Box>
            <Box marginBottom="spacer6">
              <Typography variant="intro">{intro}</Typography>
            </Box>
            <Formik
              initialValues={{
                companyName,
                ssn,
                isat,
                serviceCategory,
                address,
                postNumber,
                name: '',
                email: '',
                generalEmail: '',
                webpage: '',
                phoneNumber: '',
                approveTerms: false,
              }}
              validate={(values) => {
                const errors = {}
                if (!values.name) {
                  errors['name'] = 'Þessi reitur má ekki vera tómur'
                }
                if (!values.email) {
                  errors['email'] = 'Þessi reitur má ekki vera tómur'
                } else if (!isEmailValid(values.email)) {
                  errors['email'] = 'Netfang ekki gilt'
                }
                if (!values.generalEmail) {
                  errors['generalEmail'] = 'Þessi reitur má ekki vera tómur'
                } else if (!isEmailValid(values.generalEmail)) {
                  errors['generalEmail'] = 'Netfang ekki gilt'
                }
                if (!values.phoneNumber) {
                  errors['phoneNumber'] = 'Þessi reitur má ekki vera tómur'
                } else if (values.phoneNumber.length !== 7) {
                  errors['phoneNumber'] =
                    'Símanúmer þarf að vera sjö tölustafir'
                }
                if (!values.approveTerms) {
                  errors['approveTerms'] =
                    'Það þarf að samþykkja skilmála til að halda áfram'
                }
                return errors
              }}
              onSubmit={(values) => {
                console.log('submit', values)
              }}
              enableReinitialize
            >
              {() => (
                <Form>
                  <Box marginBottom="spacer6">
                    <Tiles columns={[1, 1, 2]} space="spacer3">
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
                        label="Isat flokkun"
                        name="isat"
                        disabled
                      />
                      <Field
                        component={FieldInput}
                        label="Þjónustuflokkur"
                        name="serviceCategory"
                        disabled
                      />
                      <Field
                        component={FieldInput}
                        label="Heimilisfang"
                        name="address"
                        disabled
                      />
                      <Field
                        component={FieldInput}
                        label="Póstnúmer"
                        name="postNumber"
                        disabled
                      />
                    </Tiles>
                  </Box>
                  <Box marginBottom="spacer6">
                    <Box marginBottom="spacer1">
                      <Typography variant="h4" as="h2">
                        Starfsemi fyrirtækis
                      </Typography>
                    </Box>
                    <Stack space="spacer5">
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
                  <Stack space="spacer3">
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
                  <Box marginY="spacer5">
                    <Field
                      component={FieldCheckbox}
                      name="approveTerms"
                      label="Ég samþykki skilmála Ferðagjafarinnar"
                    />
                  </Box>
                  <Button>Skrá fyrirtækið mitt</Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}
export default CompanySignup
