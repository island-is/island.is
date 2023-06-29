import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  ErrorScreen,
  IntroHeader,
  NotFound,
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
          title={ip?.patentName ?? ''}
          intro="Lorem ipsum dolor sit amet consectetur arcu quam quis consequat."
        />
      </Box>
      <GridRow marginBottom={2}>
        <GridColumn span="12/12">
          <Box marginBottom={3} paddingRight={2}>
            <Inline space={2}>
              <Button>Ógilding</Button>
              <Button>Veðsetning</Button>
              <Button>Nytjaleyfi</Button>
              <Button>Afturköllun</Button>
            </Inline>
          </Box>
        </GridColumn>
      </GridRow>
      <Box marginBottom={[2, 2, 6]}>
        <Stack space={2}>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(ipMessages.baseInfo)}
          </Text>
          <UserInfoLine
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
      </Box>
    </>
  )
}

export default IntellectualPropertiesDetail
