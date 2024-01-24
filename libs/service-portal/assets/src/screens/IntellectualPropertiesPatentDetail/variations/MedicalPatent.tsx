import { useLocale, useNamespaces } from '@island.is/localization'
import { UserInfoLine, formatDate, m } from '@island.is/service-portal/core'
import { ipMessages } from '../../../lib/messages'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import Timeline from '../../../components/Timeline/Timeline'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo } from 'react'
import { orderTimelineData } from '../../../utils/timelineMapper'
import { IntellectualPropertiesPatent } from '@island.is/api/schema'
import { ApolloError } from '@apollo/client'

interface Props {
  data?: IntellectualPropertiesPatent
  loading?: boolean
  error?: ApolloError
}

const MedicalPatent = ({ data, loading, error }: Props) => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()

  const orderedDates = useMemo(
    () =>
      orderTimelineData([
        {
          date: data?.lifecycle.applicationDate ?? undefined,
          message: formatMessage(ipMessages.application),
        },
        {
          date:
            data?.lifecycle.applicationDatePublishedAsAvailable ?? undefined,
          message: formatMessage(ipMessages.publish),
        },
      ]),
    [formatMessage, data?.lifecycle],
  )

  if (!data) {
    return null
  }

  if (error && !loading) {
    return <Problem error={error} />
  }

  if (!data && !loading) {
    return <Problem type="no_data" />
  }

  return (
    <Box marginBottom={[1, 1, 3]}>
      <Stack space="containerGutter">
        <Stack space="p2" dividers>
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={data?.name ?? ''}
            loading={loading}
          />
          <UserInfoLine
            label={ipMessages.applicationDate}
            content={data?.lifecycle.applicationDate ?? ''}
            loading={loading}
          />
          <UserInfoLine
            label={ipMessages.maxValidDate}
            content={data?.lifecycle.maxValidDate ?? ''}
            loading={loading}
          />
          <UserInfoLine
            label={m.status}
            content={data?.status ?? ''}
            loading={loading}
          />
        </Stack>

        {!loading && !error && (
          <Timeline
            title={formatMessage(ipMessages.timeline)}
            maxDate={orderedDates[orderedDates.length - 1].date}
            minDate={orderedDates[0].date}
          >
            {orderedDates.map((datapoint) => (
              <Stack key="list-item-application-date" space="smallGutter">
                <Text variant="h5">{formatDate(datapoint.date)}</Text>
                <Text>{datapoint.message}</Text>
              </Stack>
            ))}
          </Timeline>
        )}
        <Stack space="p2" dividers>
          <UserInfoLine
            title={formatMessage(ipMessages.owner)}
            label={formatMessage(ipMessages.name)}
            content={data?.owner?.name ?? ''}
            loading={loading}
          />
          <UserInfoLine
            label={formatMessage(ipMessages.address)}
            content={data?.owner?.address ?? ''}
            loading={loading}
          />
        </Stack>
        <Stack space="p2" dividers>
          <UserInfoLine
            title={formatMessage(ipMessages.agent)}
            label={formatMessage(ipMessages.name)}
            content={data?.agent?.name ?? ''}
            loading={loading}
          />
          <UserInfoLine
            label={formatMessage(ipMessages.address)}
            content={data?.agent?.address ?? ''}
            loading={loading}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

export default MedicalPatent
