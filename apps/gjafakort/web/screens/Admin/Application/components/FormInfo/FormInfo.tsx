import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import { CompanyApplication } from '@island.is/gjafakort-web/graphql/schema'
import {
  FieldInput,
  FieldNumberInput,
  KeyValue,
} from '@island.is/gjafakort-web/components'

import {
  Accordion,
  AccordionItem,
  BulletList,
  Bullet,
  Stack,
  Box,
  ButtonDeprecated as Button,
  Typography,
} from '@island.is/island-ui/core'

import * as styles from './FormInfo.css'

interface PropTypes {
  application: CompanyApplication
}

const UpdateCompanyApplicationMutation = gql`
  mutation UpdateCompanyApplicationMutation(
    $input: UpdateCompanyApplicationInput!
  ) {
    updateCompanyApplication(input: $input) {
      application {
        id
        webpage
        generalEmail
        email
        phoneNumber
        name
      }
    }
  }
`

function FormInfo({ application }: PropTypes) {
  const [success, setSuccess] = useState(false)
  const [updateCompanyApplication, { loading }] = useMutation(
    UpdateCompanyApplicationMutation,
  )

  const onSubmit = async (values) => {
    const response = await updateCompanyApplication({
      variables: { input: { ...values, id: application.id } },
    })
    if (!response.errors) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
    }
  }
  return (
    <>
      {application.logs && (
        <Box>
          <Accordion dividerOnTop={false} dividerOnBottom={false}>
            <AccordionItem
              label="Skoða atburðarsögu"
              labelVariant="h5"
              id={application.id}
            >
              <Stack space="gutter">
                {application.logs.map((log) => (
                  <Box key={log.id}>
                    <Typography variant="h4">{log.title}</Typography>
                    <Box display="flex" flexWrap="wrap">
                      <KeyValue
                        label="Búin til"
                        value={new Date(log.created).toLocaleString('is-IS')}
                        size="p"
                      />
                      <KeyValue
                        label="Staða umsóknar"
                        value={log.state}
                        size="p"
                      />
                      <KeyValue
                        label="Kennitala geranda"
                        value={log.authorSSN || '-'}
                        size="p"
                      />
                    </Box>
                    <pre className={styles.data}>
                      <code>
                        {JSON.stringify(JSON.parse(log.data), null, 2)}
                      </code>
                    </pre>
                  </Box>
                ))}
              </Stack>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
      <Formik
        initialValues={{
          webpage: application.webpage,
          generalEmail: application.generalEmail,
          email: application.email,
          phoneNumber: application.phoneNumber,
          name: application.name,
        }}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <Box marginBottom={8}>
              <Box marginBottom={1}>
                <Typography variant="p">
                  {application.companyDisplayName} er skráð í eftirfarandi
                  flokka:
                </Typography>
              </Box>
              <BulletList type="ul">
                {application.validLicenses && (
                  <Bullet>
                    Fyrirtækið er með rekstrarleyfi vegna veitingastaða,
                    gististaða og skemmtanahalds.
                  </Bullet>
                )}
                {application.validPermit && (
                  <Bullet>
                    Fyrirtækið er með gilt starfsleyfi Ferðamálastofu.
                  </Bullet>
                )}
                {application.operationsTrouble && (
                  <Bullet>
                    Fyrirtækið var skráð í rekstrarerfiðleikum 31. desember
                    2019.
                  </Bullet>
                )}
                {application.operatingPermitForRestaurant && (
                  <Bullet>
                    Fyrirtæki er með starfsleyfi vegna veitingastaða.
                  </Bullet>
                )}
                {application.operatingPermitForVehicles && (
                  <Bullet>
                    Fyrirtæki er með starfsleyfi vegna leigu skráningarskyldra
                    ökutækja.
                  </Bullet>
                )}
                {application.exhibition && (
                  <Bullet>
                    Fyrirtækið heldur sýningar sem gerir út á náttúru, menningu
                    eða sögu.
                  </Bullet>
                )}
              </BulletList>
            </Box>

            <Box marginBottom={4}>
              <Box marginBottom={2}>
                <Typography variant="h4" as="h2">
                  Upplýsingar fyrirtækis
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap">
                <KeyValue
                  label="Kennitala"
                  value={`${application.companySSN.slice(
                    0,
                    6,
                  )}-${application.companySSN.slice(6)}`}
                  color="blue400"
                />
                <KeyValue
                  label="Þjónustuflokkur"
                  value={application.serviceCategory}
                  color="blue400"
                />
                <KeyValue
                  label="Fjárhæð ríkisaðstoðar"
                  value={`${(application.publicHelpAmount || 0).toLocaleString(
                    'de-DE',
                  )} kr`}
                  color="blue400"
                />
              </Box>
              <Box marginBottom={5}>
                <Stack space={3}>
                  <Field
                    component={FieldInput}
                    label="Vefsíða"
                    name="webpage"
                  />
                </Stack>
              </Box>
              <Box marginBottom={12}>
                <Box marginBottom={2}>
                  <Typography variant="h4" as="h2">
                    Tengiliður
                  </Typography>
                </Box>
                <Box marginBottom={5}>
                  <Stack space={3}>
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
                      component={FieldNumberInput}
                      label="Símanúmer"
                      name="phoneNumber"
                      htmltype="tel"
                      format="### ####"
                    />
                  </Stack>
                </Box>
              </Box>
            </Box>
            {success ? (
              <Box paddingX={3} paddingY={2}>
                <Typography variant="h4" color="blue400">
                  Uppfært
                </Typography>
              </Box>
            ) : (
              <Button htmlType="submit" disabled={loading}>
                Uppfæra
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FormInfo
