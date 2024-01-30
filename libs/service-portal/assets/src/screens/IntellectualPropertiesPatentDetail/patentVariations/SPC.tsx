import { useLocale, useNamespaces } from '@island.is/localization'
import { UserInfoLine, formatDate } from '@island.is/service-portal/core'
import { ipMessages } from '../../../lib/messages'
import { m as coreMessages } from '@island.is/service-portal/core'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useMemo } from 'react'
import { IntellectualPropertiesSpc } from '@island.is/api/schema'
import { orderTimelineData } from '../../../utils/timelineMapper'
import Timeline from '../../../components/Timeline/Timeline'
import { StackOrTableBlock } from '../../../components/StackOrTableBlock/StackOrTableBlock'
import { AssetsPaths } from '../../../lib/paths'
import { StackWithBottomDivider } from '../../../components/StackWithBottomDivider/StackWithBottomDivider'

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
        date: data.publishedInGazetteDate ?? undefined,
        message: formatMessage(ipMessages.publish),
      },
      {
        date: data.grantPublishedInGazetteDate ?? undefined,
        message: formatMessage(ipMessages.applicationRegistration),
      },
      {
        date: data.lifecycle.maxValidDate ?? undefined,
        message: formatMessage(coreMessages.validTo),
      },
    ])
  }, [
    data.lifecycle,
    data.publishedInGazetteDate,
    data.grantPublishedInGazetteDate,
    formatMessage,
  ])

  console.log(orderedDates)

  return (
    <>
      <StackWithBottomDivider space="p2">
        <UserInfoLine
          title={formatMessage(ipMessages.baseInfo)}
          label={ipMessages.name}
          content={data.name ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.applicationDate}
          content={formatDate(data.lifecycle?.applicationDate) ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.applicationDatePublishedAsAvailable}
          content={formatDate(data.publishedInGazetteDate) ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.applicationRegistration}
          content={formatDate(data.grantPublishedInGazetteDate) ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.maxValidDate}
          content={formatDate(data.lifecycle?.maxValidDate) ?? ''}
          loading={loading}
        />
        <UserInfoLine
          label={coreMessages.status}
          content={data.status ?? ''}
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
      </StackWithBottomDivider>
      {!loading && !!orderedDates?.length && (
        <Timeline
          box={{ marginY: [2, 2, 6] }}
          title={formatMessage(ipMessages.timeline)}
          maxDate={orderedDates?.[orderedDates.length - 1].date}
          minDate={orderedDates[0]?.date}
        >
          {orderedDates.map((datapoint) => (
            <Stack key="list-item-application-date" space="smallGutter">
              <Text variant="h5">{formatDate(datapoint.date)}</Text>
              <Text>{datapoint.message}</Text>
            </Stack>
          ))}
        </Timeline>
      )}
      <StackWithBottomDivider box={{ marginTop: [2, 2, 6] }} space="p2">
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
      </StackWithBottomDivider>
      <StackOrTableBlock
        box={{ paddingTop: [2, 2, 6] }}
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
        box={{ paddingTop: [2, 2, 6] }}
        entries={data?.agent ? [data.agent] : []}
        title={formatMessage(ipMessages.agent)}
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
        <Box>
          <UserInfoLine
            paddingY={[2, 2, 6]}
            label={formatMessage(coreMessages.number)}
            title={formatMessage(ipMessages.basePatent)}
            content={data?.applicationNumber ?? ''}
            editLink={{
              external: true,
              url: AssetsPaths.AssetsIntellectualPropertiesPatent.replace(
                ':id',
                data.applicationNumber,
              ),
              title: formatMessage(coreMessages.view),
            }}
            loading={loading}
          />
          <Divider />
        </Box>
      )}
    </>
  )
}

export default PatentSPC
