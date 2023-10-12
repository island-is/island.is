import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  ErrorScreen,
  ExcludesFalse,
  IntroHeader,
  NotFound,
  TableGrid,
  UserInfoLine,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { ipMessages, messages } from '../../lib/messages'
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
import chunk from 'lodash/chunk'
import { useGetIntellectualPropertyTrademarkByIdQuery } from './IntellectualPropertiesTrademarkDetail.generated'
import { AudioPlayer, VideoPlayer, Image } from '@island.is/service-portal/core'
import { TrademarkType } from '@island.is/api/schema'

type UseParams = {
  id: string
}

const IntellectualPropertiesTrademarkDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertyTrademarkByIdQuery(
    {
      variables: {
        input: {
          key: id,
        },
      },
    },
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

  const ip = data?.intellectualPropertyTrademark

  if (!ip && !loading) {
    return <NotFound title={formatMessage(messages.notFound)} />
  }

  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader title={id} intro={ip?.text ?? ''} />
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

        {ip?.type === TrademarkType.TEXT && ip?.imagePath && (
          <Image url={ip.imagePath} title={ip.text ?? ''} />
        )}
        {ip?.type === TrademarkType.MULTIMEDIA && ip.media?.mediaPath && (
          <VideoPlayer url={ip.media?.mediaPath} title={ip.text ?? ''} />
        )}
        {ip?.type === TrademarkType.ANIMATION && ip.media?.mediaPath && (
          <Image
            url={ip.media?.mediaPath}
            title={ip?.text ?? ''}
            height="352px"
            width="352px"
            isAnimation
          />
        )}
        {ip?.type === TrademarkType.AUDIO && ip.media?.mediaPath && (
          <AudioPlayer url={ip.media?.mediaPath} title={ip.text ?? ''} />
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
        {!loading && !error && (
          <>
            <Timeline
              title={'Tímalína'}
              maxDate={ip?.dateExpires}
              minDate={ip?.applicationDate}
            >
              {[
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.applicationDate
                      ? formatDate(ip.applicationDate, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>Umsókn</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.datePublished
                      ? formatDate(ip.datePublished, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>Birting</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.maxValidObjectionDate
                      ? formatDate(ip.maxValidObjectionDate, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>Andmælafrestur</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.dateRegistration
                      ? formatDate(ip.dateRegistration, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>Skráning</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.dateExpires
                      ? formatDate(ip?.dateExpires, 'dd.MM.yy')
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
                    value: ip?.applicationDate
                      ? formatDate(ip.applicationDate, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Umsóknarnúmer',
                    value: ip?.vmId ? formatDate(ip?.vmId, 'dd.MM.yy') : '',
                  },
                  {
                    title: 'Birtingardagur',
                    value: ip?.datePublished
                      ? formatDate(ip.datePublished, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Myndflokkur',
                    value: ip?.imageCategories ?? '',
                  },
                  {
                    title: 'Andmælafrestur',
                    value: ip?.maxValidObjectionDate
                      ? formatDate(ip.maxValidObjectionDate, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Merkið er í lit',
                    value: ip?.isColorMark ? 'Já' : 'Nei',
                  },
                  {
                    title: 'Skráningardagur',
                    value: ip?.dateRegistration
                      ? formatDate(ip.dateRegistration, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Gildir til',
                    value: ip?.dateExpires
                      ? formatDate(ip.dateExpires, 'dd.MM.yy')
                      : '',
                  },
                ].filter(Boolean as unknown as ExcludesFalse),
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
              .filter(Boolean as unknown as ExcludesFalse)}
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
