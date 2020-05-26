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
} from '@island.is/island-ui/core'

export const CompanySelection = () => {
  return (
    <ContentBlock width="large">
      <Columns space="gutter" collapseBelow="lg">
        <Column width="2/3">
          <Box
            background="blue100"
            paddingX={[5, 12]}
            paddingY={[5, 9]}
            borderRadius="full"
            marginTop={12}
          >
            <Box marginBottom={2}>
              <Typography variant="h1" as="h1">
                Prókúruhafi
              </Typography>
            </Box>
            <Box marginBottom={6}>
              <Typography variant="intro">
                Hvaða fyrirtæki viltu skrá?
              </Typography>
            </Box>
            <Formik
              initialValues={{
                company: '',
              }}
              onSubmit={(values) => {
                console.log('submit', values)
              }}
              enableReinitialize
            >
              {() => (
                <Form>
                  <Columns space="gutter" collapseBelow="xl">
                    <Column width="1/2">
                      <Box marginBottom={6}>
                        <Field
                          component={FieldSelect}
                          name="company"
                          label="Fyrirtæki"
                          placeholder="Veldu fyrirtæki"
                          options={[
                            {
                              label: 'Kaffi Klettur',
                              value: '1903795829',
                            },
                          ]}
                        />
                      </Box>
                      <Button>Áfram</Button>
                    </Column>
                  </Columns>
                </Form>
              )}
            </Formik>
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}

export default CompanySelection
