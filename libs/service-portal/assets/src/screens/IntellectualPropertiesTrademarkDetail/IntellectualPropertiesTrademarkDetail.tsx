import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  EmptyState,
  ErrorScreen,
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  TableGrid,
  UserInfoLine,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { ipMessages } from '../../lib/messages'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Divider,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import Image from '../../components/Image/Image'
import chunk from 'lodash/chunk'
import { AudioPlayer, VideoPlayer } from '@island.is/service-portal/core'
import { TrademarkType } from '@island.is/api/schema'
import { isDefined } from '@island.is/shared/utils'
import { useGetIntellectualPropertiesTrademarkByIdQuery } from './IntellectualPropertiesTrademarkDetail.generated'

type UseParams = {
  id: string
}

const IntellectualPropertiesTrademarkDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } =
    useGetIntellectualPropertiesTrademarkByIdQuery({
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

  const ip = data?.intellectualPropertiesTrademark

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
        <Box marginBottom={3} paddingRight={2}>
          <Inline space={2}>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {'Skráningarskírteini'}
            </Button>
          </Inline>
        </Box>

        {ip?.type === TrademarkType.TEXT && (
          <Box>
            <Text variant="eyebrow" as="div" color="purple400">
              {formatMessage(ipMessages.text)}
            </Text>
            {ip?.imagePath && (
              <Image url={ip.imagePath} title={ip.text ?? ''} />
            )}
          </Box>
        )}
        {ip?.type === TrademarkType.MULTIMEDIA && (
          <Box>
            <Text variant="eyebrow" as="div" color="purple400" marginBottom={2}>
              {formatMessage(ipMessages.video)}
            </Text>
            {ip.media?.mediaPath && (
              <VideoPlayer url={ip.media?.mediaPath} title={ip.text ?? ''} />
            )}
          </Box>
        )}
        {ip?.type === TrademarkType.ANIMATION && (
          <Box>
            <Text variant="eyebrow" as="div" color="purple400">
              {formatMessage(ipMessages.animation)}
            </Text>
            {ip.media?.mediaPath && (
              <Image
                url={ip.media?.mediaPath}
                title={ip?.text ?? ''}
                height="352px"
                width="352px"
                isAnimation
              />
            )}
          </Box>
        )}
        {ip?.type === TrademarkType.AUDIO && (
          <Box>
            <Text
              variant="eyebrow"
              as="div"
              paddingBottom={2}
              color="purple400"
            >
              {formatMessage(ipMessages.audio)}
            </Text>
            {ip.media?.mediaPath && (
              <AudioPlayer url={ip.media?.mediaPath} title={ip.text ?? ''} />
            )}
          </Box>
        )}
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.text ?? ip?.vmId ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.type}
            content={ip?.type ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.status}
            content={ip?.status ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.make}
            content={ip?.subType ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.status}
            content={ip?.status ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {!loading &&
          !error &&
          ip?.lifecycle.expiryDate &&
          ip.lifecycle.applicationDate && (
            <>
              <Timeline
                title={'Tímalína'}
                maxDate={new Date(ip.lifecycle.expiryDate)}
                minDate={new Date(ip.lifecycle.applicationDate)}
              >
                {[
                  <Stack key="list-item-application-date" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.applicationDate
                        ? formatDate(ip.lifecycle.applicationDate, 'dd.MM.yy')
                        : ''}
                    </Text>
                    <Text>Umsókn</Text>
                  </Stack>,
                  <Stack key="list-item-publish-date" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.publishDate
                        ? formatDate(ip.lifecycle.publishDate, 'dd.MM.yy')
                        : ''}
                    </Text>
                    <Text>Birting</Text>
                  </Stack>,
                  <Stack
                    key="list-item-maxValidObjectionDate"
                    space="smallGutter"
                  >
                    <Text variant="h5">
                      {ip?.lifecycle.maxValidObjectionDate
                        ? formatDate(
                            ip.lifecycle.maxValidObjectionDate,
                            'dd.MM.yy',
                          )
                        : ''}
                    </Text>
                    <Text>Andmælafrestur</Text>
                  </Stack>,
                  <Stack key="list-item-registrationDate" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.registrationDate
                        ? formatDate(ip.lifecycle.registrationDate, 'dd.MM.yy')
                        : ''}
                    </Text>
                    <Text>Skráning</Text>
                  </Stack>,
                  <Stack key="list-item-expiration-date" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.expiryDate
                        ? formatDate(ip?.lifecycle.expiryDate, 'dd.MM.yy')
                        : ''}
                    </Text>
                    <Text>Gildir til</Text>
                  </Stack>,
                ]}
              </Timeline>
              <TableGrid
                title={'Upplýsingar'}
                dataArray={chunk(
                  [
                    {
                      title: 'Umsóknardagur',
                      value: ip?.lifecycle.applicationDate
                        ? formatDate(ip.lifecycle.applicationDate, 'dd.MM.yy')
                        : '',
                    },
                    {
                      title: 'Umsóknarnúmer',
                      value: ip?.vmId ? formatDate(ip?.vmId, 'dd.MM.yy') : '',
                    },
                    {
                      title: 'Birtingardagur',
                      value: ip?.lifecycle.publishDate
                        ? formatDate(ip.lifecycle.publishDate, 'dd.MM.yy')
                        : '',
                    },
                    {
                      title: 'Myndflokkur',
                      value: ip?.imageCategories ?? '',
                    },
                    {
                      title: 'Andmælafrestur',
                      value: ip?.lifecycle.maxValidObjectionDate
                        ? formatDate(
                            ip.lifecycle.maxValidObjectionDate,
                            'dd.MM.yy',
                          )
                        : '',
                    },
                    {
                      title: 'Merkið er í lit',
                      value: ip?.isColorMark ? 'Já' : 'Nei',
                    },
                    {
                      title: 'Skráningardagur',
                      value: ip?.lifecycle.registrationDate
                        ? formatDate(ip.lifecycle.registrationDate, 'dd.MM.yy')
                        : '',
                    },
                    {
                      title: 'Gildir til',
                      value: ip?.lifecycle.expiryDate
                        ? formatDate(ip.lifecycle.expiryDate, 'dd.MM.yy')
                        : '',
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
            content={ip?.markOwners?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilsfang"
            content={ip?.markOwners?.[0]?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Umboðsmaður"
            label="Nafn"
            content={ip?.markAgent?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilisfang"
            content={ip?.markAgent?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>

        {ip?.markCategories?.length && (
          <Accordion dividerOnBottom dividerOnTop={false} space={3}>
            {ip?.markCategories
              ?.map((category, index) => {
                if (!category.categoryNumber) {
                  return null
                }

                return (
                  <AccordionItem
                    key={`${category.categoryNumber}-${index}}`}
                    id={category.categoryNumber}
                    label={`Flokkur ${category.categoryNumber}`}
                  >
                    <Text>{category.categoryDescription ?? ''}</Text>
                  </AccordionItem>
                )
              })
              .filter(isDefined)}
          </Accordion>
        )}
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

export default IntellectualPropertiesTrademarkDetail
