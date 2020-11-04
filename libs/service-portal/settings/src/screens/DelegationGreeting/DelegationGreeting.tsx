import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { mockDelegationList } from './mockDelegationList'
import WipDelegationCard from './WipDelegationCard'

export const DelegationGreeting: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={4}>
        <Inline space={1}>
          <Text variant="h1">
            {formatMessage({
              id: 'sp.settings:delegation',
              defaultMessage: 'Mín réttindi',
            })}
          </Text>
          <Tag variant="mint">
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
                id: 'sp.settings:delegation-wip-intro',
                defaultMessage: `
                  Hér getur þú fundið öll þau réttindi
                  sem þú hefur fengið sent frá viðeigandi stofnunum.
                `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {mockDelegationList.map((item) => (
          <WipDelegationCard
            key={item.id}
            label={formatMessage({
              id: 'service.portal:in-progress',
              defaultMessage: 'Í vinnslu',
            })}
          />
        ))}
      </Stack>
    </>
  )
}

export default DelegationGreeting
