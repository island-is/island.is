import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import {
  Box,
  Stack,
  Inline,
  Tag,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ApplicationWIPCard } from '../../components/ApplicationCard/ApplicationWIPCard'

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={4}>
        <Inline space={1}>
          <Text variant="h1">
            {formatMessage({
              id: 'service.portal:applications',
              defaultMessage: 'Umsóknir',
            })}
          </Text>
          <Tag variant="blue" label>
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
                id: 'sp.applications:wip-intro-text',
                defaultMessage: `
                  Hér eru birt þau leyfi og umsóknir sem þú
                  hefur sótt um á Ísland.is, bæði sem einstaklingur
                  og í umboði annarra.
                  `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {[...Array(3)].map((_key, index) => (
          <ApplicationWIPCard key={index} />
        ))}
      </Stack>
    </>
  )
}

export default ApplicationList
