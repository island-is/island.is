import React from 'react'
import { defineMessages } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const RegulationDraftQuery = gql`
  query RegulationDraftQuery {
    regulationDraft {
      id
      school
      programme
      date
    }
  }
`

const msg = defineMessages({
  title: { id: 'ap.regulations-admin:edit-title' },
  intro: { id: 'ap.regulations-admin:edit-intro' },
})

const Edit = () => {
  useNamespaces('ap.regulations-admin')
  const { formatMessage } = useLocale()

  const { id } = useParams<{ id: string }>()
  const { data, loading: queryLoading } = useQuery<Query>(
    RegulationDraftQuery,
    {
      skip: id === 'new',
      variables: { id },
    },
  )

  return (
    <Box marginBottom={[6, 6, 10]}>
      <p>Hello! ... {id}</p>
      <Link to={ServicePortalPath.RegulationsAdminRoot}>
        {formatMessage('ap.regulations-admin:does-not-exist')}
      </Link>
    </Box>
  )
}

export default Edit
