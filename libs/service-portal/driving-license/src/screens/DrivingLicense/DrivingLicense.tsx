import React from 'react'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { Application, Eligibility } from './components'

type Data = {
  heading: MessageDescriptor | string
  subtext: MessageDescriptor | string
  link: string
}

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      age
    }
  }
`

function DrivingLicense(): JSX.Element {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  const { data } = useQuery<Query>(NationalRegistryUserQuery)
  const { nationalRegistryUser } = data || {}

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={[6, 6, 10]}>
        <Box>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <Stack space={2}>
                <Inline space={1}>
                  <Text variant="h1" as="h1">
                    {formatMessage({
                      id: 'sp.driving-license:title',
                      defaultMessage: 'Ökuréttindi',
                    })}
                  </Text>
                  <Tag variant="blue" outlined>
                    {formatMessage({
                      id: 'service.portal:in-progress',
                      defaultMessage: 'Í vinnslu',
                    })}
                  </Tag>
                </Inline>
                <Text as="p">
                  {formatMessage({
                    id: 'sp.driving-license:overview-subtext',
                    defaultMessage:
                      'Hér gefur að líta núverandi ökuréttindi þín og gildistíma þeirra.',
                  })}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
        {data.map((item, index) => (
          <GridRow>
            <GridColumn span="12/12" order={[2, 2, 1]}>
              <Box
                display="flex"
                flexDirection="column"
                height="full"
                justifyContent="center"
                marginTop={[3, 3, 0]}
              >
                <Box marginBottom={2}>
                  <Text variant="h2" as="h2">
                    {formatMessage(item.heading)}
                  </Text>
                </Box>
                <Text marginBottom={[3, 4]}>{formatMessage(item.subtext)}</Text>
                <Box>
                  <Link to={item.link}>
                    <ArrowLink>
                      {formatMessage({
                        id: 'service.portal:continue-button',
                        defaultMessage: 'Halda áfram',
                      })}
                    </ArrowLink>
                  </Link>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        ))}
      </Stack>
    </Box>
  )
  return (
    <>
      <Box marginBottom={4}>
        <Inline space={1}>
          <Text variant="h1" as="h1">
            {formatMessage({
              id: 'sp.driving-license:title',
              defaultMessage: 'Ökuréttindi',
            })}
          </Text>
          <Tag variant="blue" outlined>
            {formatMessage({
              id: 'service.portal:in-progress',
              defaultMessage: 'Í vinnslu',
            })}
          </Tag>
        </Inline>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.driving-license:intro',
                defaultMessage:
                  'Hér gefur að líta núverandi ökuréttindi þín og gildistíma þeirra.',
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}

export default DrivingLicense
