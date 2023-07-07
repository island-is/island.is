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

  const generateActionCard = (
    index: number,
    heading?: string | null,
    ipId?: string | null,
    description?: string | null,
    url?: string | null,
    tag?: string | null,
  ) => (
    <Box marginBottom={3} key={index}>
      <ActionCard
        text={`${ipId}${description ? ' - ' + description : ''}`}
        heading={heading ?? ''}
        cta={{
          label: formatMessage(m.view),
          variant: 'text',
          url: url ?? '',
        }}
        tag={{
          variant: 'blue',
          outlined: false,
          label: tag ?? '',
        }}
      />
    </Box>
  )

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

  console.log(JSON.stringify(data?.intellectualProperties?.trademarks))

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

      {!loading && !data?.intellectualProperties?.patents?.length && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading &&
        !error &&
        data?.intellectualProperties?.trademarks?.map((ip, index) =>
          generateActionCard(
            index,
            ip.text,
            ip.vmId,
            ip.type,
            ServicePortalPath.AssetsIntellectualPropertiesDetail.replace(
              ':id',
              ip.vmId ?? '',
            ),
            ip.status,
          ),
        )}
      {!loading &&
        !error &&
        data?.intellectualProperties?.designs?.map((ip, index) =>
          generateActionCard(
            index,
            ip.specification,
            ip.hid,
            undefined,
            ip.hid
              ? ServicePortalPath.AssetsIntellectualPropertiesDetail.replace(
                  ':id',
                  ip.hid,
                )
              : '',
            ip.status,
          ),
        )}
      {!loading &&
        !error &&
        data?.intellectualProperties?.patents?.map((ip, index) =>
          generateActionCard(
            index,
            ip.patentName || 'TEMP NAME',
            ip.applicationNumber,
            undefined,
            ServicePortalPath.AssetsIntellectualPropertiesDetail.replace(
              ':id',
              ip.applicationNumber ?? '',
            ),
            ip.statusText,
          ),
        )}
    </Box>
  )
}

export default IntellectualPropertiesOverview
