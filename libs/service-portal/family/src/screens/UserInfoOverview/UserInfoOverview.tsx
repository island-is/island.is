import React from 'react'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoOverviewItem from '../../components/UserInfoItem/UserInfoItem'
import { useLocale, useNamespaces } from '@island.is/localization'
import { mockUserInfoList } from './mockUserInfoList'

const UserInfoOverview: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.family')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={[6, 6, 10]}>
        <Box>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <Stack space={2}>
                <Text variant="h1" as="h1">
                  {formatMessage({
                    id: 'sp.family:my-info-my-data',
                    defaultMessage: 'Mín gögn',
                  })}
                </Text>
                <Text as="p">
                  {formatMessage({
                    id: 'sp.family:my-info-my-data-subtext',
                    defaultMessage:
                      'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum',
                  })}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
        {mockUserInfoList.map((item, index) => (
          <UserInfoOverviewItem
            key={index}
            heading={item.heading}
            subtext={item.subtext}
            link={item.link}
            image={item.image}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default UserInfoOverview
