import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  TableGrid,
  UserInfoLine,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { ipMessages } from '../../lib/messages'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import chunk from 'lodash/chunk'
import { useGetIntellectualPropertiesPatentByIdQuery } from './IntellectualPropertiesPatentDetail.generated'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo } from 'react'
import { orderTimelineData } from '../../utils/timelineMapper'
import { makeArrayEven } from '../../utils/makeArrayEven'

type UseParams = {
  id: string
}

const IntellectualPropertiesPatentDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertiesPatentByIdQuery({
    variables: {
      input: {
        key: id,
      },
    },
  })

  const ip = data?.intellectualPropertiesPatent

  const orderedDates = useMemo(
    () =>
      orderTimelineData([
        {
          date: ip?.lifecycle.applicationDate ?? undefined,
          message: formatMessage(ipMessages.application),
        },
        {
          date: ip?.lifecycle.registrationDate ?? undefined,
          message: formatMessage(ipMessages.registration),
        },
        {
          date: ip?.lifecycle.applicationDatePublishedAsAvailable ?? undefined,
          message: formatMessage(ipMessages.publish),
        },
        {
          date: ip?.lifecycle.maxValidObjectionDate ?? undefined,
          message: formatMessage(ipMessages.maxValidObjectionDate),
        },
      ]),
    [formatMessage, ip?.lifecycle],
  )

  const extraInfoArray = useMemo(() => {
    if (ip) {
      const extraInfoArray = [
        ip?.applicationNumber
          ? {
              title: formatMessage(ipMessages.applicationNumber),
              value: formatDate(ip?.applicationNumber),
            }
          : null,
        ip?.statusText
          ? {
              title: formatMessage(m.status),
              value: ip.statusText,
            }
          : null,
      ].filter(isDefined)

      return makeArrayEven(extraInfoArray, { title: '', value: '' })
    }
  }, [formatMessage, ip])

  if (error && !loading) {
    return <Problem type="not_found" />
  }

  if (!data?.intellectualPropertiesPatent && !loading) {
    return <Problem type="no_data" />
  }

  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader
          title={id}
          serviceProviderSlug={HUGVERKASTOFAN_SLUG}
          serviceProviderTooltip={formatMessage(
            m.intellectualPropertiesTooltip,
          )}
        />
      </Box>
      <Stack space="containerGutter">
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={m.status}
            content={ip?.statusText ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {!loading && !error && (
          <Box>
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
            <TableGrid
              title={formatMessage(ipMessages.information)}
              dataArray={chunk(extraInfoArray, 2)}
            />
          </Box>
        )}
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.owner)}
            label={formatMessage(ipMessages.name)}
            content={ip?.owner?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.address)}
            content={ip?.owner?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.designer)}
            label={formatMessage(ipMessages.name)}
            content={ip?.inventors?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.agent)}
            label={formatMessage(ipMessages.name)}
            content={ip?.agent?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.address)}
            content={ip?.agent?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
      </Stack>
    </>
  )
}

export default IntellectualPropertiesPatentDetail
