import { useLocale, useNamespaces } from '@island.is/localization'
import { UserInfoLine, formatDate } from '@island.is/service-portal/core'
import { ipMessages } from '../../../lib/messages'
import { m as coreMessages } from '@island.is/service-portal/core'
import { Stack, Text } from '@island.is/island-ui/core'
import { useMemo } from 'react'
import { IntellectualPropertiesSpc } from '@island.is/api/schema'
import { orderTimelineData } from '../../../utils/timelineMapper'
import Timeline from '../../../components/Timeline/Timeline'
import { StackOrTableBlock } from '../../../components/StackOrTableBlock/StackOrTableBlock'

interface Props {
  data: IntellectualPropertiesSpc
  loading?: boolean
}

const PatentSPC = ({ data, loading }: Props) => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()

  const orderedDates = useMemo(() => {
    if (!data.lifecycle) {
      return []
    }
    return orderTimelineData([
      {
        date: data.lifecycle.applicationDate ?? undefined,
        message: formatMessage(ipMessages.application),
      },
      {
        date: data.lifecycle.registrationDate ?? undefined,
        message: formatMessage(ipMessages.registration),
      },
      {
        date: data.lifecycle.applicationDatePublishedAsAvailable ?? undefined,
        message: formatMessage(ipMessages.publish),
      },
      {
        date: data.lifecycle.expiryDate ?? undefined,
        message: formatMessage(coreMessages.validTo),
      },
      {
        date: data.lifecycle.maxValidObjectionDate ?? undefined,
        message: formatMessage(ipMessages.maxValidObjectionDate),
      },
    ])
  }, [formatMessage, data.lifecycle])

  return (
    <>
      <Stack space="p2" dividers>
        <UserInfoLine
          title={formatMessage(ipMessages.baseInfo)}
          label={ipMessages.name}
          content={data.name ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.applicationDate}
          content={data.lifecycle?.applicationDate ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.applicationDatePublishedAsAvailable}
          content={data.lifecycle?.applicationDatePublishedAsAvailable ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={coreMessages.status}
          content={data.statusText ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.medicineTitle}
          content={data.medicine ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.medicineForChildren}
          content={
            data.medicineForChildren === undefined
              ? undefined
              : data.medicineForChildren
              ? formatMessage(coreMessages.yes)
              : formatMessage(coreMessages.no)
          }
          loading={loading}
        />
      </Stack>
      {!loading && (
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
          title={formatMessage(ipMessages.marketingAuthorization)}
          label={formatMessage(ipMessages.marketingAuthorizationNumber)}
          content={
            data.marketingAuthorization?.foreignAuthorizationNumber ?? ''
          }
          loading={loading}
        />
        <UserInfoLine
          label={formatMessage(coreMessages.date)}
          content={
            formatDate(data.marketingAuthorization?.foreignAuthorizationDate) ??
            ''
          }
          loading={loading}
        />
      </Stack>
      <StackOrTableBlock
        entries={data?.owners ?? []}
        title={{
          singular: formatMessage(ipMessages.owner),
          plural: formatMessage(ipMessages.owners),
        }}
        columns={[
          {
            label: formatMessage(ipMessages.name),
            key: 'name',
          },
          {
            label: formatMessage(ipMessages.address),
            key: 'addressFull',
          },
        ]}
      />
      <StackOrTableBlock
        entries={data?.agent ? [data.agent] : []}
        title="agent"
        columns={[
          {
            label: formatMessage(ipMessages.name),
            key: 'name',
          },
          {
            label: formatMessage(ipMessages.address),
            key: 'addressFull',
          },
        ]}
      />
      {data.applicationNumber && (
        <UserInfoLine
          label={formatMessage(coreMessages.number)}
          title={formatMessage(ipMessages.basePatent)}
          content={data?.applicationNumber ?? ''}
          editLink={{
            external: true,
            url: `https://www.hugverk.is/leit/patent/${data.applicationNumber}`,
            title: formatMessage(coreMessages.view),
          }}
          loading={loading}
        />
      )}
    </>
  )
}

export default PatentSPC
