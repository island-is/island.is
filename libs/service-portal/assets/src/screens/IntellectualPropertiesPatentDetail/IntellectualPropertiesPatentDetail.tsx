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
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import chunk from 'lodash/chunk'
import { useGetIntellectualPropertiesPatentByIdQuery } from './IntellectualPropertiesPatentDetail.generated'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'

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

  if (error && !loading) {
    return <Problem type="not_found" />
  }

  if (!data?.intellectualPropertiesPatent && !loading) {
    return <Problem type="no_data" />
  }

  const ip = data?.intellectualPropertiesPatent
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
        <GridRow>
          <GridColumn span="12/12">
            <Box marginBottom={3} paddingRight={2}>
              <Inline space={2}>
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
          </GridColumn>
        </GridRow>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.status}
            content={ip?.statusText ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {!loading && !error && (
          <>
            <Timeline title={formatMessage(ipMessages.timeline)}>
              {[
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.applicationDate
                      ? formatDate(ip.lifecycle.applicationDate)
                      : ''}
                  </Text>
                  <Text>{formatMessage(ipMessages.application)}</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.registrationDate
                      ? formatDate(ip.lifecycle.registrationDate)
                      : ''}
                  </Text>
                  <Text>{formatMessage(ipMessages.registration)}</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.applicationDatePublishedAsAvailable
                      ? formatDate(
                          ip.lifecycle.applicationDatePublishedAsAvailable,
                        )
                      : ''}
                  </Text>
                  <Text>{formatMessage(ipMessages.publishDate)}</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.maxValidObjectionDate
                      ? formatDate(ip.lifecycle.maxValidObjectionDate)
                      : ''}
                  </Text>
                  <Text>{formatMessage(ipMessages.maxValidObjectionDate)}</Text>
                </Stack>,
              ]}
            </Timeline>
            <TableGrid
              title={formatMessage(ipMessages.information)}
              dataArray={chunk(
                [
                  {
                    title: formatMessage(ipMessages.applicationNumber),
                    value: ip?.applicationNumber
                      ? formatDate(ip?.applicationNumber)
                      : '',
                  },
                  {
                    title: formatMessage(m.status),
                    value: ip?.statusText ?? '',
                  },
                  {
                    title: formatMessage(ipMessages.registrationDate),
                    value: ip?.lifecycle.registrationDate
                      ? formatDate(ip.lifecycle.registrationDate)
                      : '',
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
