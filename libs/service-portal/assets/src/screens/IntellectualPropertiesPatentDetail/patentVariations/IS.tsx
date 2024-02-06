import { useLocale, useNamespaces } from '@island.is/localization'
import {
  UserInfoLine,
  formatDate,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { IntellectualPropertiesPatentIs } from '@island.is/api/schema'
import { Divider, Stack, Text } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { ipMessages } from '../../../lib/messages'
import { useMemo } from 'react'
import Timeline from '../../../components/Timeline/Timeline'
import { orderTimelineData } from '../../../utils/timelineMapper'
import { StackOrTableBlock } from '../../../components/StackOrTableBlock/StackOrTableBlock'
import { StackWithBottomDivider } from '../../../components/StackWithBottomDivider/StackWithBottomDivider'
import { AssetsPaths } from '../../../lib/paths'

interface Props {
  data: IntellectualPropertiesPatentIs
  loading?: boolean
}

const PatentIS = ({ data, loading }: Props) => {
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
        message: formatMessage(ipMessages.applicationRegistration),
      },
      {
        date: data.lifecycle.publishDate ?? undefined,
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

  if (!data && !loading) {
    return <Problem type="no_data" />
  }

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
          content={
            data.lifecycle?.applicationDate
              ? formatDate(data.lifecycle.applicationDate)
              : undefined
          }
          loading={loading}
        />
        <UserInfoLine
          label={ipMessages.maxValidDate}
          content={
            data.lifecycle?.maxValidDate
              ? formatDate(data.lifecycle.maxValidDate)
              : undefined
          }
          loading={loading}
        />
        {data?.lifecycle?.registrationDate && (
          <UserInfoLine
            label={ipMessages.applicationRegistrationDate}
            content={
              data?.lifecycle?.registrationDate
                ? formatDate(data.lifecycle?.registrationDate)
                : undefined
            }
            loading={loading}
          />
        )}
        <UserInfoLine
          label={coreMessages.status}
          content={data.statusText ?? ''}
          loading={loading}
        />
        {data?.registrationNumber && (
          <UserInfoLine
            label={ipMessages.patentNumber}
            content={data.registrationNumber ?? ''}
            loading={loading}
          />
        )}
      </StackWithBottomDivider>
      {!loading && (
        <Timeline
          box={{ marginY: [2, 2, 6] }}
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
        box={{ marginY: [2, 2, 6] }}
        entries={data?.inventors ?? []}
        title={{
          singular: formatMessage(ipMessages.inventor),
          plural: formatMessage(ipMessages.inventors),
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
      {data?.priorities && (
        <StackOrTableBlock
          box={{ marginTop: [2, 2, 6] }}
          entries={data?.priorities}
          title={formatMessage(ipMessages.priority)}
          columns={[
            {
              label: formatMessage(coreMessages.number),
              key: 'number',
            },
            {
              label: formatMessage(coreMessages.date),
              isDate: true,
              key: 'applicationDate',
            },
            {
              label: formatMessage(coreMessages.country),
              key: 'country',
            },
          ]}
        />
      )}
      {data?.pct?.date && data?.pct?.number && (
        <StackOrTableBlock
          box={{ marginTop: [2, 2, 6] }}
          entries={data?.pct ? [data.pct] : []}
          title={formatMessage(ipMessages.internationalApplication)}
          columns={[
            {
              label: formatMessage(ipMessages.pctNumber),
              key: 'number',
            },
            {
              label: formatMessage(ipMessages.pctDate),
              isDate: true,
              key: 'date',
            },
          ]}
        />
      )}
      {data.spcNumbers?.[0] && (
        <>
          <UserInfoLine
            paddingY={[2, 2, 6]}
            title={formatMessage(ipMessages.supplementaryProtection)}
            label={formatMessage(ipMessages.spcNumber)}
            content={data.spcNumbers[0]}
            editLink={{
              external: true,
              url: AssetsPaths.AssetsIntellectualPropertiesPatent.replace(
                ':id',
                data.spcNumbers[0],
              ),
              title: formatMessage(coreMessages.view),
            }}
          />
          <Divider />
        </>
      )}
      <UserInfoLine
        paddingY={[2, 2, 6]}
        title={formatMessage(ipMessages.classification)}
        label={formatMessage(ipMessages.category)}
        content={data.classifications?.map((c) => c.category).join(', ')}
      />
      <Divider />
    </>
  )
}

export default PatentIS
