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
import { useGetIntellectualPropertyPatentByIdQuery } from './IntellectualPropertiesPatentDetail.generated'

type UseParams = {
  id: string
}

const IntellectualPropertiesPatentDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertyPatentByIdQuery({
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
          module: formatMessage(m.intellectualProperty).toLowerCase(),
        })}
      />
    )
  }

  if (!data?.intellectualPropertyPatent && !loading) {
    return <NotFound title={formatMessage(m.notFound)} />
  }

  const ip = data?.intellectualPropertyPatent
  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader
          title={ip?.patentName || 'SOME PATENT'}
          intro="Lorem ipsum dolor sit amet consectetur arcu quam quis consequat."
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
          </GridColumn>
        </GridRow>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.patentName ?? ''}
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
            <Timeline title={'Tímalína'}>
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
                    {ip?.registeredDate
                      ? formatDate(ip.registeredDate, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>Skráning</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.applicationDatePublishedAsAvailable
                      ? formatDate(
                          ip.applicationDatePublishedAsAvailable,
                          'dd.MM.yy',
                        )
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
                    value: ip?.applicationNumber
                      ? formatDate(ip?.applicationNumber, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Birtingardagur',
                    value: ip?.applicationDatePublishedAsAvailable
                      ? formatDate(
                          ip.applicationDatePublishedAsAvailable,
                          'dd.MM.yy',
                        )
                      : '',
                  },
                  {
                    title: 'Flokkun',
                    value: ip?.internalClassifications?.[0]?.category ?? '',
                  },
                  {
                    title: 'Andmælafrestur',
                    value: ip?.maxValidObjectionDate
                      ? formatDate(ip?.maxValidObjectionDate, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Staða',
                    value: ip?.statusText ?? '',
                  },
                  {
                    title: 'Skráningardagur',
                    value: ip?.registeredDate
                      ? formatDate(ip.registeredDate, 'dd.MM.yy')
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
            content={ip?.owner?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilsfang"
            content={ip?.owner?.home ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Hönnuður"
            label="Nafn"
            content={ip?.inventors?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Umboðsmaður"
            label="Nafn"
            content={ip?.patentAgent?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilisfang"
            content={ip?.patentAgent?.address ?? ''}
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

export default IntellectualPropertiesPatentDetail
