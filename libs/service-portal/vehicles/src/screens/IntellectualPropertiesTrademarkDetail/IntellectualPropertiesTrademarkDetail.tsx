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
import { useGetIntellectualPropertyTrademarkByIdQuery } from './IntellectualPropertiesTrademarkDetail.generated'

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

  if (!data?.intellectualPropertyTrademark && !loading) {
    return <NotFound title={formatMessage(m.notFound)} />
  }

  const ip = data?.intellectualPropertyTrademark
  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader
          title={ip?.text || 'SOME TRADEMARK'}
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
                  {'Skráningarskírteini'}
                </Button>
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.text ?? ''}
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
                    {ip?.dateRegistration
                      ? formatDate(ip.dateRegistration, 'dd.MM.yy')
                      : ''}
                  </Text>
                  <Text>Skráning</Text>
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
                ].filter((Boolean as unknown) as ExcludesFalse),
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
        <Stack space="p2">
          {ip?.markCategories?.length &&
            ip?.markCategories.map((c) => (
              <>
                <UserInfoLine
                  label={`Flokkur ${c.categoryNumber}`}
                  content={c.categoryDescription ?? ''}
                  loading={loading}
                />
                <Divider />
              </>
            ))}
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

export default IntellectualPropertiesTrademarkDetail
