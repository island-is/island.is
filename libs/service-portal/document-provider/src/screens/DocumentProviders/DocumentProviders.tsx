import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { Organisation } from '@island.is/api/schema'
import { DocumentProvidersSearch } from './DocumentProvidersSearch'
import { DocumentProvidersDashboard } from './DocumentProvidersDashboard'

export type OrganisationPreview = Pick<
  Organisation,
  'name' | 'id' | 'nationalId'
>

const getOrganisationsPreviewQuery = gql`
  query GetOrganisationsPreviewQuery {
    getProviderOrganisations {
      name
      id
      nationalId
    }
  }
`

const DocumentProviders: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { data, error } = useQuery(getOrganisationsPreviewQuery, {
    fetchPolicy: 'cache-and-network',
  })

  const organisationsPreview: OrganisationPreview[] =
    data?.getProviderOrganisations || []
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h1" as="h1">
          {formatMessage(m.documentProvidersTitle)}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <Text as="p">{formatMessage(m.documentProvidersDescription)}</Text>
      </Box>
      <DocumentProvidersDashboard />
      {!error && (
        <DocumentProvidersSearch organisationsPreview={organisationsPreview} />
      )}
    </Box>
  )
}

export default DocumentProviders
