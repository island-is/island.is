import React from 'react'
import { Formik, Form, Field } from 'formik'

import {
  FieldSelect,
  Box,
  Column,
  Columns,
  Button,
  Typography,
  Option,
} from '@island.is/island-ui/core'

export type CompanyType = {
  name: string
  ssn: string | number
}

interface PropTypes {
  onSubmit: (values: CompanyType) => void
  companies: CompanyType[]
}

interface FormValues {
  company: Option | undefined
}

function SelectionForm({ onSubmit, companies }: PropTypes) {
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
              <Button type="submit">Áfram</Button>
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

export default SelectionForm
