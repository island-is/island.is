import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  Gallery,
  GalleryItem,
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  TableGrid,
  UserInfoLine,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import chunk from 'lodash/chunk'
import { isDefined } from '@island.is/shared/utils'
import { useGetIntellectualPropertiesDesignQuery } from './IntellectualPropertiesDesignDetail.generated'
import { ipMessages } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo } from 'react'
import { orderTimelineData } from '../../utils/timelineMapper'
import { makeArrayEven } from '../../utils/makeArrayEven'

type UseParams = {
  id: string
}

const IntellectualPropertiesDesignDetail = () => {
  useNamespaces('sp.intellectual-properties')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertiesDesignQuery({
    variables: {
      input: {
        key: id,
      },
    },
  })

  const ip = data?.intellectualPropertiesDesign

  const orderedDates = useMemo(
    () =>
      orderTimelineData([
        {
          date: ip?.lifecycle.internationalRegistrationDate ?? undefined,
          message: formatMessage(ipMessages.internationalRegistration),
        },
        {
          date: ip?.lifecycle.publishDate ?? undefined,
          message: formatMessage(ipMessages.publish),
        },
        {
          date: ip?.lifecycle.registrationDate ?? undefined,
          message: formatMessage(ipMessages.registration),
        },
        {
          date: ip?.lifecycle.expiryDate ?? undefined,
          message: formatMessage(ipMessages.expires),
        },
      ]),
    [formatMessage, ip?.lifecycle],
  )

  const extraInfoArray = useMemo(() => {
    if (ip) {
      const extraInfoArray = [
        ip?.lifecycle?.internationalRegistrationDate
          ? {
              title: formatMessage(ipMessages.internationalRegistrationDate),
              value: ip?.lifecycle.internationalRegistrationDate,
            }
          : null,
        ip?.applicationNumber
          ? {
              title: formatMessage(ipMessages.applicationNumber),
              value: ip?.applicationNumber ?? '',
            }
          : null,
        ip?.classification
          ? {
              title: formatMessage(ipMessages.classification),
              value: ip?.classification?.[0] ?? '',
            }
          : null,
        ip?.lifecycle.registrationDate
          ? {
              title: formatMessage(ipMessages.registrationDate),
              value: formatDate(ip.lifecycle.registrationDate),
            }
          : null,
        ip?.status
          ? {
              title: formatMessage(m.status),
              value: ip?.status,
            }
          : null,
      ].filter(isDefined)

      return makeArrayEven(extraInfoArray, { title: '', value: '' })
    }
  }, [formatMessage, ip])

  if (error && !loading) {
    return <Problem error={error} />
  }

  if (!ip && !loading) {
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
        <Box>
          <Text variant="eyebrow" as="div" paddingBottom={2} color="purple400">
            {formatMessage(ipMessages.images)}
          </Text>
          <Gallery
            loading={loading}
            thumbnails={data?.intellectualPropertiesDesignImageList?.images.map(
              (item, i) => {
                if (!item) {
                  return null
                }

                return (
                  <GalleryItem key={i} thumbnail>
                    <img
                      width={365}
                      height={365}
                      src={`data:image/png;base64,${item.image}`}
                      alt={`design-${item.designNumber}-nr-${item.imageNumber}`}
                    />
                  </GalleryItem>
                )
              },
            )}
          >
            {data?.intellectualPropertiesDesignImageList?.images.map(
              (item, i) => {
                if (!item) {
                  return null
                }

                return (
                  <GalleryItem key={i}>
                    <img
                      width={365}
                      height={365}
                      src={`data:image/png;base64,${item.image}`}
                      alt={`design-${item.designNumber}-nr-${item.imageNumber}`}
                    />
                  </GalleryItem>
                )
              },
            )}
          </Gallery>
        </Box>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={formatMessage(ipMessages.name)}
            content={ip?.specification?.specificationText ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.description)}
            content={ip?.specification?.description ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(m.status)}
            content={ip?.status ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {!loading &&
          !error &&
          ip?.lifecycle.expiryDate &&
          ip?.lifecycle.internationalRegistrationDate && (
            <>
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
                title={formatMessage(ipMessages.otherInformation)}
                dataArray={chunk(extraInfoArray, 2)}
              />
            </>
          )}
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.owner)}
            label={formatMessage(ipMessages.name)}
            content={ip?.owners?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.address)}
            content={ip?.owners?.[0]?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {ip?.designers?.length && (
          <Stack space="p2">
            <UserInfoLine
              title={formatMessage(ipMessages.designer)}
              label={formatMessage(ipMessages.name)}
              content={ip?.designers?.[0]?.name ?? ''}
              loading={loading}
            />
            <Divider />
          </Stack>
        )}
        {ip?.agent?.address && ip?.agent?.name && (
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
        )}
      </Stack>
    </>
  )
}

export default IntellectualPropertiesDesignDetail
