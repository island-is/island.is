import React from 'react'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage({
                  id: 'service.portal:my-info',
                  defaultMessage: 'Mínar upplýsingar',
                })}
              </Text>
              <Text as="p" variant="intro">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}

export default AssetsOverview
