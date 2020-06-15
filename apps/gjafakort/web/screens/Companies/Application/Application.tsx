import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import { Box, Typography } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { ContentLoader, FormLayout } from '@island.is/gjafakort-web/components'
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
  const {
    t: { application: t, routes },
  } = useI18n()
  const router = useRouter()
  const { data, loading } = useQuery(GetCompaniesQuery)
  const { companies } = data || {}
  const onSubmit = ({ ssn }) => {
    router.push(`${routes.companies.application}/${ssn}`)
  }

  if (loading && !data) {
    return <ContentLoader />
  }

  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          {t.title}
        </Typography>
      </Box>
      {companies.length > 0 ? (
        <SelectionForm onSubmit={onSubmit} companies={companies} />
      ) : (
        <NoConnection />
      )}
    </FormLayout>
  )
}

export default Companies
