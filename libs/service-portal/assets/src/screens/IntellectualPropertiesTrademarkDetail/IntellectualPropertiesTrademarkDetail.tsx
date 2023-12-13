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
import { Problem } from '@island.is/react-spa/shared'

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
    return <Problem type="not_found" />
  }

  const ip = data?.intellectualPropertiesTrademark

  if (!ip && !loading) {
    return <Problem type="no_data" />
  }

  const categories = ip?.markCategories?.filter(
    (c) => !!c.categoryDescription && !!c.categoryNumber,
  )

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
              {formatMessage(ipMessages.registrationCertificate)}
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
            content={ip?.typeReadable ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={m.status}
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
        </Stack>
        {!loading &&
          !error &&
          ip?.lifecycle.expiryDate &&
          ip.lifecycle.applicationDate && (
            <>
              <Timeline
                title={formatMessage(ipMessages.timeline)}
                maxDate={new Date(ip.lifecycle.expiryDate)}
                minDate={new Date(ip.lifecycle.applicationDate)}
              >
                {[
                  <Stack key="list-item-application-date" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.applicationDate
                        ? formatDate(ip.lifecycle.applicationDate)
                        : ''}
                    </Text>
                    <Text>{formatMessage(ipMessages.application)}</Text>
                  </Stack>,
                  <Stack key="list-item-publish-date" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.publishDate
                        ? formatDate(ip.lifecycle.publishDate)
                        : ''}
                    </Text>
                    <Text>{formatMessage(ipMessages.publish)}</Text>
                  </Stack>,
                  <Stack
                    key="list-item-maxValidObjectionDate"
                    space="smallGutter"
                  >
                    <Text variant="h5">
                      {ip?.lifecycle.maxValidObjectionDate
                        ? formatDate(ip.lifecycle.maxValidObjectionDate)
                        : ''}
                    </Text>
                    <Text>
                      {formatMessage(ipMessages.maxValidObjectionDate)}
                    </Text>
                  </Stack>,
                  <Stack key="list-item-registrationDate" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.registrationDate
                        ? formatDate(ip.lifecycle.registrationDate)
                        : ''}
                    </Text>
                    <Text> {formatMessage(ipMessages.registration)}</Text>
                  </Stack>,
                  <Stack key="list-item-expiration-date" space="smallGutter">
                    <Text variant="h5">
                      {ip?.lifecycle.expiryDate
                        ? formatDate(ip?.lifecycle.expiryDate)
                        : ''}
                    </Text>
                    <Text>{formatMessage(ipMessages.expires)}</Text>
                  </Stack>,
                ]}
              </Timeline>
              <TableGrid
                title={formatMessage(ipMessages.information)}
                dataArray={chunk(
                  [
                    {
                      title: formatMessage(ipMessages.expires),
                      value: ip?.vmId ? formatDate(ip?.vmId) : '',
                    },
                    {
                      title: formatMessage(ipMessages.imageCategories),
                      value: ip?.imageCategories ?? '',
                    },
                    {
                      title: formatMessage(ipMessages.colorMark),
                      value: ip?.isColorMark
                        ? formatMessage(m.yes)
                        : formatMessage(m.no),
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
            content={ip?.markOwners?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.address)}
            content={ip?.markOwners?.[0]?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {ip?.markAgent?.name && ip?.markAgent.address && (
          <Stack space="p2">
            <UserInfoLine
              title={formatMessage(ipMessages.agent)}
              label={formatMessage(ipMessages.name)}
              content={ip?.markAgent?.name ?? ''}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(ipMessages.address)}
              content={ip?.markAgent?.address ?? ''}
              loading={loading}
            />
            <Divider />
          </Stack>
        )}

        {!!categories?.length && (
          <Accordion dividerOnTop={false} space={3}>
            {ip?.markCategories
              ?.map((category, index) => {
                if (!category.categoryNumber) {
                  return null
                }

                return (
                  <AccordionItem
                    key={`${category.categoryNumber}-${index}}`}
                    id={category.categoryNumber}
                    label={`${formatMessage(ipMessages.category)} ${
                      category.categoryNumber
                    }`}
                  >
                    <Text>{category.categoryDescription ?? ''}</Text>
                  </AccordionItem>
                )
              })
              .filter(isDefined)}
          </Accordion>
        )}
      </Stack>
    </>
  )
}

export default IntellectualPropertiesTrademarkDetail
