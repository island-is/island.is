import { useState } from 'react'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useLocale } from '@island.is/localization'
import { Box, DatePicker, GridColumn, GridRow } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { Organisation } from '@island.is/api/schema'
import { DocumentProvidersSearch } from './DocumentProvidersSearch'
import { DocumentProvidersDashboard } from './DocumentProvidersDashboard'
import { IntroHeader } from '@island.is/portals/core'
import { DocumentProvidersLoading } from '../../components/DocumentProvidersLoading/DocumentProvidersLoading'

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

const DocumentProviders = () => {
  const user = useUserInfo()
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const { formatMessage } = useLocale()
  const { data, error } = useQuery(getOrganisationsPreviewQuery, {
    fetchPolicy: 'cache-and-network',
  })

  const today = new Date()
  const organisationsPreview: OrganisationPreview[] =
    data?.getProviderOrganisations || []

  if (!user) {
    return <DocumentProvidersLoading />
  }

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <IntroHeader
          title={formatMessage(m.documentProvidersTitle)}
          intro={formatMessage(m.documentProvidersDescription)}
        />
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
                minDate={new Date(2011, 0, 1)}
                maxDate={new Date()}
                minYear={2011}
                maxYear={today.getFullYear()}
                handleChange={(date: Date) => setFromDate(date)}
                size="xs"
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
                minDate={new Date(2011, 0, 1)}
                maxDate={new Date()}
                minYear={2011}
                maxYear={today.getFullYear()}
                handleChange={(date: Date) => setToDate(date)}
                hasError={fromDate && toDate && toDate < fromDate}
                errorMessage={formatMessage(
                  m.documentProvidersDateToErrorMessage,
                )}
                size="xs"
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
          <DocumentProvidersSearch
            organisationsPreview={organisationsPreview}
          />
        )}
      </Box>
    </>
  )
}

export default DocumentProviders
