import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  EmptyState,
  ErrorScreen,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { ipMessages as messages } from '../../lib/messages'
import { useGetPatentsQuery } from './IntellectualPropertiesOverview.generated'

const IntellectualPropertiesOverview = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage, locale } = useLocale()

  const { loading, data, error } = useGetPatentsQuery({})

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.intellectualProperty).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.title)}
        intro={formatMessage(messages.description)}
      />

      {loading && (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      )}

      {!loading && !data?.intellectualPropertyPatentCollection?.length && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading &&
        !error &&
        data?.intellectualPropertyPatentCollection?.map((ip, index) => {
          return (
            <Box marginBottom={3} key={index}>
              <ActionCard
                text={`${ip.applicationNumber ?? ''} - SOME CATEGORY`}
                heading={ip.patentName || 'TEMP HEADING'}
                cta={{
                  label: formatMessage(m.view),
                  variant: 'text',
                  url: ip.applicationNumber
                    ? ServicePortalPath.AssetsIntellectualPropertiesDetail.replace(
                        ':id',
                        ip.applicationNumber,
                      )
                    : undefined,
                }}
                tag={{
                  variant: 'blue',
                  outlined: false,
                  label: ip.statusText ?? '',
                }}
              />
            </Box>
          )
        })}
    </Box>
  )
}

export default IntellectualPropertiesOverview
