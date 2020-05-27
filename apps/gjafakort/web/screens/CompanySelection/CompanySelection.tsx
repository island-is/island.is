import React from 'react'
import { Formik, Form, Field } from 'formik'
import {
  FieldSelect,
  Box,
  ContentBlock,
  Column,
  Columns,
  Button,
  Typography,
  Option,
} from '@island.is/island-ui/core'
import { Company } from '../CompanySignupWrapper/CompanySignupWrapper'
import Link from 'next/link'

interface CompanySelectionProps {
  onSubmit: (values: Company) => void
  companies: Company[]
}

interface FormValues {
  company: Option | undefined
}

export const CompanySelection = ({
  onSubmit,
  companies,
}: CompanySelectionProps) => {
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
                Prókúruhafi
              </Typography>
              {companies.length > 0 ? (
                <CompanySelectionForm
                  onSubmit={onSubmit}
                  companies={companies}
                />
              ) : (
                <NoConnectedCompanies />
              )}
            </Box>
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}

const CompanySelectionForm = ({
  onSubmit,
  companies,
}: CompanySelectionProps) => {
  const initialValues: FormValues = {
    company: undefined,
  }
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        onSubmit({
          name: values.company.label,
          ssn: values.company.value,
        })
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <Box marginBottom={6}>
            <Typography variant="intro">Hvaða fyrirtæki viltu skrá?</Typography>
          </Box>
          <Columns space="gutter" collapseBelow="xl">
            <Column width="1/2">
              <Box marginBottom={6}>
                <Field
                  component={FieldSelect}
                  name="company"
                  label="Fyrirtæki"
                  placeholder="Veldu fyrirtæki"
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.ssn,
                  }))}
                />
              </Box>
              <Button>Áfram</Button>
            </Column>
          </Columns>
          <Columns space="gutter" collapseBelow="xl">
            <Column width="2/3">
              <Box marginTop={6}>
                <Typography variant="p">
                  Ef fyrirtækið þitt er ekki í fellilistanum ert þú ekki
                  prókúruhafi þess, vinsamlegast hafðu samband við RSK
                </Typography>
              </Box>
            </Column>
          </Columns>
        </Form>
      )}
    </Formik>
  )
}

const NoConnectedCompanies = () => (
  <>
    <Box marginBottom={5}>
      <Typography variant="intro">
        Þú ert ekki skráður prókúruhafi, vinsamlegast hafðu samband við RSK
      </Typography>
    </Box>
    <Link href="/">
      <span>
        <Button variant="text">Tilbaka</Button>
      </span>
    </Link>
  </>
)

export default CompanySelection
