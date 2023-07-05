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
  m,
} from '@island.is/service-portal/core'
import { ipMessages } from '../../lib/messages'
import { useGetIntellectualPropertyByIdQuery } from './IntellectualPropertiesDetail.generated'
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

type UseParams = {
  id: string
}

const IntellectualPropertiesDetail = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertyByIdQuery({
    variables: {
      input: {
        applicationId: id,
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
          title={ip?.patentName || 'SOME DEFAULT TITLE'}
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
          </GridColumn>
        </GridRow>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.patentName ?? ''}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.type}
            content={ip?.classificationType ?? ''}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.make}
            content={ip?.internalClassifications?.[0]?.type ?? ''}
          />
          <Divider />
          <UserInfoLine label={ipMessages.status} content={ip?.status ?? ''} />
          <Divider />
        </Stack>
        <Timeline title={'Tímalína'}>
          {[
            <Stack space="smallGutter">
              <Text variant="h5">03.02.20</Text>
              <Text>Umsókn</Text>
            </Stack>,
            <Stack space="smallGutter">
              <Text variant="h5">05.02.20</Text>
              <Text>Skráning</Text>
            </Stack>,
            <Stack space="smallGutter">
              <Text variant="h5">10.08.30</Text>
              <Text>Birting</Text>
            </Stack>,
            <Stack space="smallGutter">
              <Text variant="h5">12.12.46</Text>
              <Text>Andmælafrestur</Text>
            </Stack>,
            <Stack space="smallGutter">
              <Text variant="h5">30.63.6803</Text>
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
                value: '06.03.20',
              },
              {
                title: 'Umsóknarnúmer',
                value: 'VOT344664',
              },
              {
                title: 'Birtingardagur',
                value: '15.05.20',
              },
              {
                title: 'Myndflokkur',
                value: '24Jfdgh',
              },
              {
                title: 'Andmælafrestur',
                value: '17.07.20',
              },
              {
                title: 'Merkið er í lit',
                value: 'Já',
              },
              {
                title: 'Skráningardagur',
                value: '24.04.20',
              },
            ].filter((Boolean as unknown) as ExcludesFalse),
            2,
          )}
        />
        <Stack space="p2">
          <UserInfoLine
            title="Eigandi"
            label="Nafn"
            content="
            Þjálfunarmúll fyrir hesta"
          ></UserInfoLine>
          <Divider />
          <UserInfoLine label="Heimilsfang" content="Leirvogstunga 29" />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Hönnuður"
            label="Nafn"
            content="Eiríkur Ingólfsson"
          ></UserInfoLine>
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Umboðsmaður"
            label="Nafn"
            content="Árnason Faktor ehf."
          ></UserInfoLine>
          <Divider />
          <UserInfoLine
            label="Heimilisfang"
            content="Guðríðarstíg 2-4, 113 Reykjavík"
          ></UserInfoLine>
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

export default IntellectualPropertiesDetail
