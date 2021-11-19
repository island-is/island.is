import React, { useState } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
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
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const { formatMessage } = useLocale()
  const { data, error } = useQuery(getOrganisationsPreviewQuery, {
    fetchPolicy: 'cache-and-network',
  })

  const today = new Date()
  const organisationsPreview: OrganisationPreview[] =
    data?.getProviderOrganisations || []
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h3" as="h1">
          {formatMessage(m.documentProvidersTitle)}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <Text as="p">{formatMessage(m.documentProvidersDescription)}</Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <GridRow>
          <GridColumn span="6/12">
            <DatePicker
              id="fromDate"
              label={formatMessage(m.documentProvidersDateFromLabel)}
              placeholderText={formatMessage(
                m.documentProvidersDateFromPlaceholderText,
              )}
              locale="is"
              minDate={new Date(2011, 1, 1)}
              maxDate={new Date()}
              minYear={2011}
              maxYear={today.getFullYear()}
              handleChange={(date: Date) => setFromDate(date)}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <DatePicker
              id="toDate"
              label={formatMessage(m.documentProvidersDateToLabel)}
              placeholderText={formatMessage(
                m.documentProvidersDateToPlaceholderText,
              )}
              locale="is"
              minDate={new Date(2011, 1, 1)}
              maxDate={new Date()}
              minYear={2011}
              maxYear={today.getFullYear()}
              handleChange={(date: Date) => setToDate(date)}
              hasError={fromDate && toDate && toDate < fromDate}
              errorMessage={formatMessage(
                m.documentProvidersDateToErrorMessage,
              )}
            />
          </GridColumn>
        </GridRow>
      </Box>
      {!error && (
        <DocumentProvidersDashboard
          organisationsCount={organisationsPreview.length}
          fromDate={fromDate}
          toDate={toDate}
        />
      )}
      {!error && (
        <DocumentProvidersSearch organisationsPreview={organisationsPreview} />
      )}
    </Box>
  )
}

export default DocumentProviders
