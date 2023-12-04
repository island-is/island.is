import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  EmptyState,
  ErrorScreen,
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
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.intellectualProperties).toLowerCase(),
        })}
      />
    )
  }
  const ip = data?.intellectualPropertiesDesign

  if (!ip && !loading) {
    return <EmptyState />
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
              {'Ógilding'}
            </Button>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {'Veðsetning'}
            </Button>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {'Nytjaleyfi'}
            </Button>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {'Afturköllun'}
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
            label={formatMessage(ipMessages.status)}
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
                title={'Tímalína'}
                maxDate={new Date(ip.lifecycle.expiryDate)}
                minDate={new Date(ip.lifecycle.internationalRegistrationDate)}
              >
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.internationalRegistrationDate
                      ? formatDate(
                          ip.lifecycle.internationalRegistrationDate,
                          'dd.MM.yy',
                        )
                      : ''}
                  </Text>
                  <Text>
                    {formatMessage(ipMessages.internationalRegistration)}
                  </Text>
                </Stack>
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.expiryDate
                      ? formatDate(ip.lifecycle.expiryDate, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>{formatMessage(ipMessages.expires)}</Text>
                </Stack>
              </Timeline>
              <TableGrid
                title={'Aðrar upplýsingar'}
                dataArray={chunk(
                  [
                    {
                      title: formatMessage(
                        ipMessages.internationalRegistrationDate,
                      ),
                      value: ip?.lifecycle.internationalRegistrationDate
                        ? formatDate(
                            ip.lifecycle.internationalRegistrationDate,
                            'dd.MM.yy',
                          )
                        : '',
                    },
                    {
                      title: 'Umsóknarnúmer',
                      value: ip?.applicationNumber ?? '',
                    },
                    {
                      title: 'Flokkun',
                      value: ip?.classification?.[0] ?? '',
                    },
                    {
                      title: 'Umsóknardagur',
                      value: ip?.lifecycle.registrationDate
                        ? formatDate(ip.lifecycle.registrationDate, 'dd.MM.yy')
                        : '',
                    },
                    {
                      title: 'Staða',
                      value: ip?.status ?? '',
                    },
                    //cheap hack to make the underline not disappear
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
            title="Eigandi"
            label="Nafn"
            content={ip?.owners?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilsfang"
            content={ip?.owners?.[0]?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Hönnuður"
            label="Nafn"
            content={ip?.designers?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Umboðsmaður"
            label="Nafn"
            content={ip?.agent?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilisfang"
            content={ip?.agent?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Text variant="small" paddingBottom={2}>
          Lorem ipsum dolor sit amet consectetur. Sem libero at mi feugiat diam.
          Turpis quam dignissim eleifend lectus venenatis. Nullam et aliquet
          augue ultrices dignissim nibh. Orci justo diam tincidunt et ut.
          Egestas tincidunt aliquam consectetur feugiat lectus. Risus fringilla
          vitae nec id lectus ullamcorper.
        </Text>
      </Stack>
    </>
  )
}

export default IntellectualPropertiesDesignDetail
