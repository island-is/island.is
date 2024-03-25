import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { Organisation } from '@island.is/api/schema'
import { DocumentProvidersSearch } from './DocumentProvidersSearch'
import { DocumentProvidersDashboard } from './DocumentProvidersDashboard'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { documentProviderNavigation } from '../../lib/navigation'

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
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <Box paddingBottom={4}>
            <PortalNavigation
              navigation={documentProviderNavigation}
              title={formatMessage(m.documentProviders)}
            />
          </Box>
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
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
                    minDate={new Date(2011, 1, 1)}
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
                    minDate={new Date(2011, 1, 1)}
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
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default DocumentProviders
