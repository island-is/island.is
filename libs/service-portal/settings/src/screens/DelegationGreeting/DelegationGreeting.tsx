import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { mockDelegationList } from './mockDelegationList'
import * as styles from './DelegationGreeting.treat'

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
          <Box
            position="relative"
            border="standard"
            borderRadius="large"
            key={item.id}
          >
            <Box position="absolute" className={styles.wipTag}>
              <Tag variant="blue">Væntanlegt</Tag>
            </Box>
            <div className={styles.cardBlurWrapper}>
              <Box paddingY={3} paddingX={4}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  marginBottom={1}
                >
                  <Text variant="eyebrow" color="purple400">
                    {item.provider}
                  </Text>
                </Box>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                >
                  <Text variant="h4" color="blue400">
                    {item.title}
                  </Text>
                  <Box background="blue100" borderRadius="circle" padding={1}>
                    <Icon
                      type="outline"
                      icon="add"
                      size="medium"
                      color="blue400"
                    />
                  </Box>
                </Box>
              </Box>
            </div>
          </Box>
        ))}
      </Stack>
    </>
  )
}

export default DelegationGreeting
