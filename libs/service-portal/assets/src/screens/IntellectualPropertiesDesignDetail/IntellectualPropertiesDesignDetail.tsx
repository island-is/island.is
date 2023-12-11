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
import {
  Box,
  Button,
  Divider,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import chunk from 'lodash/chunk'
import { isDefined } from '@island.is/shared/utils'
import { useGetIntellectualPropertiesDesignQuery } from './IntellectualPropertiesDesignDetail.generated'
import { ipMessages } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

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

  if (error && !loading) {
    return <Problem type="not_found" />
  }
  const ip = data?.intellectualPropertiesDesign

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
          <Inline space={2}>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {formatMessage(ipMessages.invalidation)}
            </Button>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {formatMessage(ipMessages.mortgage)}
            </Button>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {formatMessage(ipMessages.usagePermit)}
            </Button>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {formatMessage(ipMessages.revocation)}
            </Button>
          </Inline>
        </Box>
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
                maxDate={new Date(ip.lifecycle.expiryDate)}
                minDate={new Date(ip.lifecycle.internationalRegistrationDate)}
              >
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.internationalRegistrationDate
                      ? formatDate(ip.lifecycle.internationalRegistrationDate)
                      : ''}
                  </Text>
                  <Text>
                    {formatMessage(ipMessages.internationalRegistration)}
                  </Text>
                </Stack>
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.expiryDate
                      ? formatDate(ip.lifecycle.expiryDate)
                      : ''}
                  </Text>
                  <Text>{formatMessage(ipMessages.expires)}</Text>
                </Stack>
              </Timeline>
              <TableGrid
                title={formatMessage(ipMessages.otherInformation)}
                dataArray={chunk(
                  [
                    {
                      title: formatMessage(
                        ipMessages.internationalRegistrationDate,
                      ),
                      value: ip?.lifecycle.internationalRegistrationDate
                        ? formatDate(ip.lifecycle.internationalRegistrationDate)
                        : '',
                    },
                    {
                      title: formatMessage(ipMessages.applicationNumber),
                      value: ip?.applicationNumber ?? '',
                    },
                    {
                      title: formatMessage(ipMessages.classification),
                      value: ip?.classification?.[0] ?? '',
                    },
                    {
                      title: formatMessage(ipMessages.registrationDate),
                      value: ip?.lifecycle.registrationDate
                        ? formatDate(ip.lifecycle.registrationDate)
                        : '',
                    },
                    {
                      title: formatMessage(m.status),
                      value: ip?.status ?? '',
                    },
                    {
                      title: '',
                      value: '',
                    },
                  ].filter(isDefined),
                  2,
                )}
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
