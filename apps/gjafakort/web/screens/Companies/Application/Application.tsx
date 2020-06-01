import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Box,
  ContentBlock,
  Column,
  Columns,
  Typography,
} from '@island.is/island-ui/core'

import { SelectionForm, NoConnection } from './components'

const GetCompaniesQuery = gql`
  query GetCompaniesQuery {
    companies {
      ssn
      name
    }
  }
`

function Companies() {
  const router = useRouter()
  const { data } = useQuery(GetCompaniesQuery)
  if (!data) {
    return <div>Loading...</div>
  }

  const { companies } = data

  const onSubmit = ({ ssn }) => {
    router.push(`/fyrirtaeki/umsokn/${ssn}`)
  }

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
                <SelectionForm onSubmit={onSubmit} companies={companies} />
              ) : (
                <NoConnection />
              )}
            </Box>
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}

export default Companies
